import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}
  async create(createReviewDto: CreateReviewDto) {
    const isExist = await this.reviewRepository.findBy({
      rating: createReviewDto.rating,
      tour: createReviewDto.tourId,
    });
    if (isExist.length)
      throw new BadRequestException('Такой отзыв уже существует!');
    
    const newReview = {
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      img: createReviewDto.img,
      tour: createReviewDto.tourId,
    };
    return await this.reviewRepository.save(newReview);
  }

  async findAll() {
    const review = await this.reviewRepository.find({relations: {tour: true}});
    if(!review) throw new NotFoundException('Отзывов не найдено!')
    return review;
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: {id: id}
    });
    if(!review) throw new NotFoundException('Такой отзыв не найден!')
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewRepository.findOne({
      where: {id: id}
    })
    if(!review) throw new NotFoundException('Такого тура нет!');
    Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(review);
  }

  async remove(id: number) {
    const review = await this.reviewRepository.findOne({
      where: {id: id}
    })
    if(!review) throw new NotFoundException("Такого отзыва нет!")
    return await this.reviewRepository.delete(id);
  }
}
