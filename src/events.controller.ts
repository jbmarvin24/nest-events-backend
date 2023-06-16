import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-event.dto';

@Controller('/events')
export class EventsController {
  private events: Event[] = [];

  @Get()
  findAll() {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id) {
    const event = this.events.find((e) => e.id === parseInt(id));

    return event;
  }

  @Post()
  create(@Body() dto: CreateEventDto) {
    const createdEvent: Event = {
      ...dto,
      when: new Date(dto.when),
      id: this.events.length + 1,
    };

    this.events.push(createdEvent);

    return createdEvent;
  }

  @Patch(':id')
  update(@Param('id') id, @Body() dto: UpdateEventDto) {
    const index = this.events.findIndex((e) => e.id === parseInt(id));

    const updatedEvent = {
      ...this.events[index],
      ...dto,
      when: dto.when ? new Date(dto.when) : this.events[index].when,
    };

    this.events[index] = updatedEvent;

    return updatedEvent;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id) {
    this.events = this.events.filter((e) => e.id !== parseInt(id));
  }
}
