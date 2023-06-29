import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from '../events/attendee.entity';
import { Event } from '../events/event.entity';
import { Profile } from './profile.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Expose()
  @Field()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  @Expose()
  @Field()
  email: string;

  @Column()
  @Expose()
  @Field()
  firstName: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  @Expose()
  profile: Profile;

  @OneToMany(() => Event, (event) => event.organizer)
  @Expose()
  organized: Event[];

  @OneToMany(() => Attendee, (attende) => attende.user)
  attended: Attendee[];
}
