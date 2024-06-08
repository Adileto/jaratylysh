import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, TypeOrmModule.forFeature([Payment])
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentModule],
})
export class PaymentModule {}
