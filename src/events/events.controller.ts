import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { ListEvents } from './dto/list.events';
import { UsePipes } from '@nestjs/common/decorators/core';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    this.logger.log('Hit the Find All route');
    const events =
      await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          total: true,
          curentPage: filter.page,
          limit: 2,
        },
      );
    this.logger.debug(`Found ${events.data.length} events`);

    return events;
  }

  @Get('/practice')
  async practice() {
    return await this.repository.find({
      where: {
        id: MoreThan(2),
      },
    });
  }

  @Get('/practice2')
  async practice2() {
    const event = await this.repository.findOne({
      where: {
        id: 1,
      },
    });

    const attendee = new Attendee();
    attendee.name = 'Batman';
    attendee.event = event;

    await this.attendeeRepository.save(attendee);

    return event;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.getEvent(id);

    if (!event) {
      throw new NotFoundException();
    }

    return event;
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
    const event = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!event) {
      throw new NotFoundException();
    }

    return await this.repository.save({
      ...event,
      ...dto,
      when: dto.when ? new Date(dto.when) : event.when,
    });
  }

  // @Post('/remove')
  // public async removingRelation() {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id) {
    const result = await this.eventsService.deleteEvent(id);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }
}
