import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { In } from 'typeorm';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get('admin/all')
  findAll(@Query() query: any) {
    return this.orderService.findAll(query);
  }

  @Get('ongoing')
  ongoing() {
    return this.orderService.findAll({ paymentStatus: 'pending' });
  }

  @Get('history')
  history() {
    return this.orderService.findAll({ paymentStatus: In(['paid', 'unpaid']) });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Put(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() statusJson: any) {
    return this.orderService.updateStatus(id, statusJson.status);
  }

  @Put(':id/payment')
  updatePaymentStatus(@Param('id', ParseIntPipe) id: number, @Body() statusJson: any) {
    return this.orderService.updatePaymentStatus(id, statusJson.paymentStatus);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }
}
