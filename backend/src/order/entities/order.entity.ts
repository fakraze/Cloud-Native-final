import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsNumber, IsInt, IsEnum, IsOptional, IsString, IsDateString, IsArray } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { OrderItem } from './order-item.entity';

enum OrderStatus {
    pending = 'pending',
    confirmed = 'confirmed',
    preparing = 'preparing',
    ready = 'ready',
    completed = 'completed',
    cancelled = 'cancelled',
    delivered = 'delivered',
}

enum PaymentStatus {
    pending = 'pending',
    paid = 'paid',
    failed = 'failed',
}

enum DeliveryType {
    pickup = 'pickup',
    dineIn = 'dine-in',
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @OneToOne(() => Restaurant)
    @JoinColumn({ name: 'restaurantId' })
    restaurant: Restaurant;

    @Column()
    @IsNotEmpty()
    @IsInt()
    restaurantId: number;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    @IsArray()
    items: OrderItem[];

    @Column('int')
    @IsNotEmpty()
    @IsNumber()
    totalAmount: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.pending,
    })
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.pending,
    })
    @IsEnum(PaymentStatus)
    paymentStatus: PaymentStatus;

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    notes?: string;

    @Column({
        type: 'enum',
        enum: DeliveryType,
    })
    @IsEnum(DeliveryType)
    deliveryType: DeliveryType;

    @Column()
    @IsNotEmpty()
    @IsString()
    paymentMethod: string;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
