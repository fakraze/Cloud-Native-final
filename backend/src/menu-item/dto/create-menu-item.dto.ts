import { OmitType } from '@nestjs/mapped-types';
import { MenuItem } from '../entities/menu-item.entity';
import { IsOptional, IsBoolean } from 'class-validator';

export class CreateMenuItemDto extends OmitType(MenuItem, [
  'id',
  'restaurant',
  'isAvailable',
  'createdAt',
  'updatedAt'
] as const) {
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}