import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-event.dto';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('/events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  @Get()
  async findAll() {
    return await this.repository.find();
  }

  @Get('/practice')
  async practice() {
    return await this.repository.find({
      where: {
        id: MoreThan(2),
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.repository.findOne({
      where: {
        id,
      },
    });
  }

  @Post()
  async create(@Body() dto: CreateEventDto) {
    return await this.repository.save({
      ...dto,
      when: new Date(dto.when),
    });
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() dto: UpdateEventDto) {
    console.log(id);

    const event = await this.repository.findOne({
      where: {
        id,
      },
    });

    return await this.repository.save({
      ...event,
      ...dto,
      when: dto.when ? new Date(dto.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id) {
    const event = await this.repository.findOne({
      where: {
        id,
      },
    });
    return await this.repository.remove(event);
  }
}
