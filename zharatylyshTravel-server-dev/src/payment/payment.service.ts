import { Injectable } from '@nestjs/common';
import { CreatePaymentDto, PaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
    );
  }

  async createPaymentIntent(
    price: number,
    currency: string,
  ): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: price,
      currency,
    });
    // Сохранение данных о платеже в базу данных
    const payment = new Payment();
    payment.stripePaymentIntentId = paymentIntent.id;
    payment.price = price;
    payment.currency = currency;
    payment.status = paymentIntent.status;

    await this.paymentsRepository.save(payment);

    return paymentIntent;
  }

  async getAllPayments(): Promise<Payment[]> {
    return await this.paymentsRepository.find({
      relations: { user: true, bookedTour: true },
    });
  }

  // async getOnePayment(id: number): Promise<Payment> {
  //   return await this.paymentsRepository.findOne({
  //     where: { tour: { base: { user: { id: id } } } },
  //   });
  // }
}
