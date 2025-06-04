import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { IsString, IsNotEmpty, IsInt, IsOptional, IsBoolean, IsArray, IsObject, Min } from 'class-validator';

@Entity()
export class MenuItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "restaurantId" })
    restaurant: Restaurant;

    @Column()
    @IsInt()
    @IsNotEmpty()
    restaurantId: number;

    @Column()
    @IsString()
    @IsNotEmpty()    
    name: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    description: string;

    @Column('int')
    @IsInt()
    @Min(0)
    price: number;

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    imageUrl: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    category: string;

    @Column({ default: true })
    @IsOptional()
    @IsBoolean()
    isAvailable: boolean;

    @Column('int')
    @IsInt()
    @Min(0)
    preparationTime: number;

    @Column('simple-array')
    @IsArray()
    @IsString({ each: true })
    allergens: string[];    

    @Column('simple-json')
    @IsObject()
    nutritionInfo: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };

    @Column('simple-array')
    @IsArray()
    customizations: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;    
}
