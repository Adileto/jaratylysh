import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSightDto } from './dto/create-sight.dto';
import { UpdateSightDto } from './dto/update-sight.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sight } from './entities/sight.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SightsService {
  constructor(
    @InjectRepository(Sight)
    private readonly sightsRepository: Repository<Sight>,
  ) {}
  async create(createSightDto: CreateSightDto) {
    const isExist = await this.sightsRepository.findBy({
      title: createSightDto.title,
      img: createSightDto.img,
    });
    if (isExist.length)
      throw new BadRequestException(
        'Такая достопримечательность уже существует!',
      );
    const newSight = {
      title: createSightDto.title,
      img: createSightDto.img,
      description: createSightDto.description,
      imgList: createSightDto.imgList,
      tour: createSightDto.tour,
    };
    if (!newSight) throw new BadRequestException('Somithing went wrong...');
    return await this.sightsRepository.save(newSight);
  }

  async findAll() {
    const sight = await this.sightsRepository.find({
      relations: { tour: true },
    });
    if (!sight)
      throw new NotFoundException('Достопримечательности не найдены!');
    return sight;
  }

  async findOne(id: number) {
    const sight = await this.sightsRepository.findOne({
      where: { id: id },
    });
    if (!sight) throw new NotFoundException('Такой достопримечательности нет!');
    return sight;
  }

  async update(id: number, updateSightDto: UpdateSightDto) {
    const sight = await this.sightsRepository.findOne({
      where: { id: id },
    });
    if (!sight) throw new NotFoundException('Такой достопримечательности нет!');
    Object.assign(sight, updateSightDto);
    return await this.sightsRepository.save(sight);
  }

  async remove(id: number) {
    const sight = await this.sightsRepository.findOne({
      where: { id: id },
    });
    if (!sight) throw new NotFoundException('Такой достопримечательности нет!');
    return await this.sightsRepository.delete(id);
  }
}
