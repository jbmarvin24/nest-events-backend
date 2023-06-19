import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../auth/user.entity';
import { paginate, PaginateOptions } from '../pagination/paginator';
import { AttendeeAnswerEnum } from './attendee.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { ListEvents, WhenEventFilter } from './dto/list.events';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, PaginatedEvents } from './event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery(): SelectQueryBuilder<Event> {
    return this.eventsRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public getEventsWithAttendeeCountQuery(): SelectQueryBuilder<Event> {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Rejected,
          }),
      );
  }

  private getEventsWithAttendeeCountFilteredQuery(
    filter?: ListEvents,
  ): SelectQueryBuilder<Event> {
    let query = this.getEventsWithAttendeeCountQuery();

    if (!filter) return query;

    if (filter.when) {
      if (filter.when == WhenEventFilter.Today) {
        query = query.andWhere(
          `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`,
        );
      }

      if (filter.when == WhenEventFilter.Tommorow) {
        query = query.andWhere(
          `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`,
        );
      }

      if (filter.when == WhenEventFilter.ThisWeek) {
        query = query.andWhere(`YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)`);
      }

      if (filter.when == WhenEventFilter.NextWeek) {
        query = query.andWhere(
          `YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1`,
        );
      }
    }

    return query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    paginationOptions: PaginateOptions,
  ) {
    return await paginate(
      this.getEventsWithAttendeeCountFilteredQuery(filter),
      paginationOptions,
    );
  }

  public async getEventWithAttendeeCount(
    id: number,
  ): Promise<Event | undefined> {
    return await this.getEventsWithAttendeeCountQuery()
      .andWhere('e.id = :id', { id })
      .getOne();
  }

  public async findOne(id: number): Promise<Event | undefined> {
    return await this.eventsRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async createEvent(input: CreateEventDto, user: User): Promise<Event> {
    return await this.eventsRepository.save(
      new Event({
        ...input,
        organizer: user,
        when: new Date(input.when),
      }),
    );
  }

  public async updateEvent(
    event: Event,
    input: UpdateEventDto,
  ): Promise<Event> {
    return await this.eventsRepository.save(
      new Event({
        ...event,
        ...input,
        when: input.when ? new Date(input.when) : event.when,
      }),
    );
  }

  public async deleteEvent(id: number): Promise<DeleteResult> {
    return await this.eventsRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  public async getEventsOrganizedByUserIdPaginated(
    userId: number,
    paginationOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    return await paginate<Event>(
      this.getEventsOrganizedByUserIdQuery(userId),
      paginationOptions,
    );
  }

  private getEventsOrganizedByUserIdQuery(
    userId: number,
  ): SelectQueryBuilder<Event> {
    return this.getEventsBaseQuery().where('e.organizerId = :userId', {
      userId,
    });
  }

  public async getEventsAttendedByUserIdPaginated(
    userId: number,
    paginationOptions: PaginateOptions,
  ): Promise<PaginatedEvents> {
    return await paginate<Event>(
      this.getEventsAttendedByUserIdQuery(userId),
      paginationOptions,
    );
  }

  private getEventsAttendedByUserIdQuery(
    userId: number,
  ): SelectQueryBuilder<Event> {
    return this.getEventsBaseQuery()
      .leftJoinAndSelect('e.attendees', 'a')
      .where('e.userId = :userId', {
        userId,
      });
  }
}
