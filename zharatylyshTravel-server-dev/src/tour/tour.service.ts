import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tour } from './entities/tour.entity';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(Tour) private readonly tourRepository: Repository<Tour>,
  ) {}
  async create(createTourDto: CreateTourDto) {
    const isExist = await this.tourRepository.findBy({
      title: createTourDto.title,
    });
    if (isExist.length)
      throw new BadRequestException('Такой тур уже существует!');
    const newTour = {
      title: createTourDto.title,
      startDate: createTourDto.startDate,
      endDate: createTourDto.endDate,
      price: createTourDto.price,
      amount: createTourDto.amount,
      img: createTourDto.img,
      description: createTourDto.description,
      location: createTourDto.location,
      isApprove: createTourDto.isApprove,
      user: createTourDto.user,
    };
    if (!newTour) throw new BadRequestException('Something went wrond...');
    return await this.tourRepository.save(newTour);
  }

  async findAll() {
    const tours = await this.tourRepository.find({
      relations: { review: true, user: true, sights: true },
    });
    if (!tours) throw new NotFoundException('Туров не найдено!');
    return tours;
  }

  async findOne(id: number) {
    const tour = await this.tourRepository.findOne({
      where: { id: id },
      relations: {review: true, sights: true},
    });
    if (!tour) throw new NotFoundException('Такого тура нет!');
    return tour;
  }

  async update(id: number, updateTourDto: UpdateTourDto) {
    const tour = await this.tourRepository.findOne({
      where: { id: id },
    });
    if (!tour) throw new NotFoundException('Такого тура нет!');
    Object.assign(tour, updateTourDto);
    return await this.tourRepository.save(tour);
  }

  async remove(id: number) {
    const tour = await this.tourRepository.findOne({
      where: { id: id },
    });
    if (!tour) throw new NotFoundException('Такого тура нет!');
    return await this.tourRepository.delete(id);
  }
}