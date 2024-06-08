import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body('price') price: number, @Body('currency') currency: string) {
    return this.paymentService.createPaymentIntent(price, currency);
  }

  @Get('all')
  async getAllPayments() {
    return this.paymentService.getAllPayments();
  }

  // @Get('getOne')
  // async getOnePayment(@Req() req) {
  //   return this.paymentService.getOnePayment(+req.user.id);
  // }
}
