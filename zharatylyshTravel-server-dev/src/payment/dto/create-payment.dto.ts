import { IsArray, IsNumber } from "class-validator";

export class CreatePaymentDto {
    @IsNumber()
    price: number;
    
    @IsNumber()
    quantity: number;
}

export class PaymentDto {
    @IsArray()
    items: CreatePaymentDto[]
}
