import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { Tour } from 'src/tour/entities/tour.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateReviewDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  img: string;

  @ApiProperty()
  @IsNotEmpty()
  tourId: Tour;

  @ApiProperty()
  @IsOptional()
  userId: User;
}
