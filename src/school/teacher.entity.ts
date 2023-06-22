import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from './subject.entity';

@Entity()
@ObjectType()
@InputType('TeacherInput')
export class Teacher {
  @PrimaryGeneratedColumn()
  @Field({ nullable: true })
  id: number;

  @Column()
  @Field()
  name: string;

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @Field(() => [Subject], { nullable: true })
  subjects: Subject[];
}
