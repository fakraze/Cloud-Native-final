import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsNumber, IsString, IsArray, IsNotEmpty, IsOptional, Min, IsInt } from 'class-validator';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    userId: number;

    @OneToMany(() => CartItem, (item) => item.cart, { eager: true })
    items: CartItem[];

    @Column('int', { default: 0 }) 
    totalAmount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

