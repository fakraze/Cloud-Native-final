import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { IsNumber, IsString, IsOptional, IsObject, Min } from 'class-validator';
import { Cart } from './cart.entity';
import { MenuItem } from '../../menu-item/entities/menu-item.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @Column('simple-json')
  @OneToOne(() => MenuItem, { eager: true })
  menuItem: MenuItem;

  @Column('int')
  @IsNumber()
  @Min(1)
  quantity: number;

  @Column('simple-json', { nullable: true })
  @IsOptional()
  @IsObject()
  customizations?: object;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @Column('int', { default: 0 })
  @IsNumber()
  @Min(0)
  subtotal: number;
}