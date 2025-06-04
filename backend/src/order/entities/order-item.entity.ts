import { MenuItem } from '../../menu-item/entities/menu-item.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @OneToOne(() => MenuItem, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'menuItemId' })
    menuItem: MenuItem;

    @Column({ nullable: true })
    menuItemId: number;

    @Column('int')
    quantity: number;

    @Column('int')
    price: number;

    @Column('simple-json', { nullable: true })
    customizations?: object;

    @Column({ nullable: true })
    notes?: string;
}