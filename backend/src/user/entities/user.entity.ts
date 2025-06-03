import { IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsEmail()
    @IsNotEmpty() 
    email: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsEnum(['employee', 'admin', 'staff'])
    @IsNotEmpty()
    role: 'employee' | 'admin' | 'staff';

    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    phone?: string;

    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;    
}