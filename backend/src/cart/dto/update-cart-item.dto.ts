import { IsInt, IsOptional, IsObject, IsString, Min, isInt } from 'class-validator';

export class UpdateCartItemDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsObject()
  customizations?: object;

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}
