import { Logger } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherAddInput } from './input/teacher-add.input';
import { Teacher } from './teacher.entity';

@Resolver(() => Teacher)
export class TeacherResolver {
  private readonly logger = new Logger(TeacherResolver.name);

  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  @Query(() => [Teacher])
  public async teachers(): Promise<Teacher[]> {
    return await this.teachersRepository.find();
  }

  @Query(() => Teacher)
  public async teacher(
    @Args('id', { type: () => Int })
    id: number,
  ): Promise<Teacher> {
    return await this.teachersRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  @Mutation(() => Teacher, { name: 'teacherAdd' })
  public async name(
    @Args('input', { type: () => TeacherAddInput })
    input: TeacherAddInput,
  ): Promise<Teacher> {
    return await this.teachersRepository.save(new Teacher(input));
  }

  // If you want to customize the field resolver
  @ResolveField('subjects')
  public async subjects(@Parent() teacher: Teacher) {
    this.logger.debug(`@ResolveField subjects are called`);

    return await teacher.subjects;
  }
}
