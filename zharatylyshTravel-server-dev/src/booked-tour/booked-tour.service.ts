import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookedTourDto } from './dto/create-booked-tour.dto';
import { UpdateBookedTourDto } from './dto/update-booked-tour.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookedTour } from './entities/booked-tour.entity';
import { Repository } from 'typeorm';
import { Tour } from 'src/tour/entities/tour.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BookedTourService {
  private stripe: Stripe;
  constructor(
    @InjectRepository(BookedTour)
    private readonly bookedTourRepository: Repository<BookedTour>,
    @InjectRepository(Tour) private readonly mytourRepository: Repository<Tour>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
    );
  }
  async create(createBookedTourDto: CreateBookedTourDto) {
    const tourData = await this.mytourRepository.findBy({
      id: +createBookedTourDto.tour,
    });
    if (!tourData.length)
      throw new BadRequestException('Такого тура не существует для брони!');

    const isExist = await this.bookedTourRepository.findBy({
      tour: { id: +createBookedTourDto.tour },
      user: { id: +createBookedTourDto.user },
    });
    if (isExist.length)
      throw new BadRequestException('Такой тур уже забронирован!');

    const selectedTour = tourData[0];
    if (selectedTour.amount < createBookedTourDto.amount) {
      throw new BadRequestException('Недостаточно мест для бронирования!');
    }

    tourData[0].amount -= createBookedTourDto.amount;
    await this.mytourRepository.save(tourData);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: tourData[0].price * createBookedTourDto.amount,
      currency: 'kgs',
    });
 
    const newBookedTour = {
      sum: createBookedTourDto.sum,
      amount: createBookedTourDto.amount,
      tour: createBookedTourDto.tour,
      user: createBookedTourDto.user,
    };
    const savedBookedTour = await this.bookedTourRepository.save(newBookedTour);

    const payment = this.paymentRepository.create({
      stripePaymentIntentId: paymentIntent.id,
      price: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      user: { id: +createBookedTourDto.user },
      bookedTour: {id: +savedBookedTour.id}
    });
    await this.paymentRepository.save(payment);
    return {
      savedBookedTour,
      paymentIntentClientSecret: paymentIntent.client_secret,
    };
  }

  async findAll() {
    const bookedTour = await this.bookedTourRepository.find({
      relations: { tour: true, user: true, payments: true },
    });
    if (!bookedTour) throw new NotFoundException('Такой тур не заброинрован!');
    return bookedTour;
  }

  async findOne(id: number) {
    const bookedTour = await this.bookedTourRepository.findOne({
      where: { id },
    });
    if (!bookedTour) throw new NotFoundException('Такой тур не заброинрован!');
    return bookedTour;
  }

  async update(id: number, updateBookedTourDto: UpdateBookedTourDto) {
    const bookedTour = await this.bookedTourRepository.findOne({
      where: { id },
    });
    if (!bookedTour) throw new NotFoundException('Такой тур не заброинрован!');
    Object.assign(bookedTour, updateBookedTourDto);
    return await this.bookedTourRepository.save(bookedTour);
  }

  async remove(id: number) {
    const bookedTour = await this.bookedTourRepository.findOne({
      where: { id },
    });
    if (!bookedTour) throw new NotFoundException('Такой тур не забронирован!');
    return await this.bookedTourRepository.delete(id);
  }
}
