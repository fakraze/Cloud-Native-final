import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { MenuItem } from '../../menu-item/entities/menu-item.entity';

@Entity()
export class Restaurant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    cuisine: string;

    @Column()
    address: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column('float')
    rating: number;

    @Column()
    totalRatings: number;

    @Column()
    deliveryTime: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => MenuItem, menuItem => menuItem.restaurant)
    menuItems: MenuItem[];
}