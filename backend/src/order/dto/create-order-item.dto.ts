import { IsNotEmpty, IsNumber, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  menuItemId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsObject()
  customizations?: object;

  @IsOptional()
  @IsString()
  notes?: string;
}
