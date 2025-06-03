import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { CartModule } from './cart/cart.module';

require('dotenv').config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST!,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_DATABASE!,
      entities: [],
      autoLoadEntities: true,
      synchronize: true, //Change to false in production
    }),
    RestaurantModule,
    MenuItemModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
