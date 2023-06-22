import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';

@Resolver(() => Teacher)
export class TeacherResolver {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  @Query(() => [Teacher])
  public async teachers(): Promise<Teacher[]> {
    return await this.teachersRepository.find({
      relations: ['subjects'],
    });
  }

  @Query(() => Teacher)
  public async teacher(
    @Args('id', { type: () => Int })
    id: number,
  ): Promise<Teacher> {
    return await this.teachersRepository.findOneOrFail({
      relations: ['subjects'],
      where: {
        id,
      },
    });
  }
}
