import { PartialType } from '@nestjs/mapped-types';
import { CreateBookedTourDto } from './create-booked-tour.dto';

export class UpdateBookedTourDto extends PartialType(CreateBookedTourDto) {}
