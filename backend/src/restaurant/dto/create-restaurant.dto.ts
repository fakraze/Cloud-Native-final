import { IsString, IsNotEmpty, IsEmail, IsNumber, IsOptional, IsBoolean, Min, Max, IsPositive } from 'class-validator';

export class CreateRestaurantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    cuisine: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Max(5)
    rating: number;

    @IsNumber()
    @Min(0)
    totalRatings: number;

    @IsString()
    @IsNotEmpty()
    deliveryTime: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}