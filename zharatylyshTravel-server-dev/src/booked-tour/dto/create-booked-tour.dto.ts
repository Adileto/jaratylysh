import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { Tour } from 'src/tour/entities/tour.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateBookedTourDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  sum: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  user: User;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  tour: Tour;

}
