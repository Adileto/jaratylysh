import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  confirmationCode: boolean;

  @ApiProperty()
  // @IsNotEmpty()
  role?: string;
  
  @ApiProperty()
  country?: string;
  @ApiProperty()
  cardNumber?: string;
}
