import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  ParseIntPipe,
  SerializeOptions,
} from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { AttendeesService } from './attendees.service';

@Controller('events/:eventId/attendees')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventAttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.attendeesService.findByEventId(eventId);
  }
}
