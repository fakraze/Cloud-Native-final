import { IsString, IsInt, IsOptional, IsObject, Min, IsIn } from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  userId: number;

  @IsInt()
  menuItemId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsObject()
  customizations?: object;

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}
