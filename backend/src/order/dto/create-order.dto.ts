import { OmitType } from '@nestjs/mapped-types';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import {
    IsOptional,
    IsString,
    IsArray,
    IsNumber,
    IsEnum,
    IsNotEmpty,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto extends OmitType(Order, [
    'id',
    'user',
    'restaurant',
    'status',
    'paymentStatus',
    'updatedAt',
    'createdAt',
] as const) {
}

