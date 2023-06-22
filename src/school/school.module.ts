import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';
import { TeacherResolver } from './teacher.resolver';
import { TrainingController } from './training.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher])],
  providers: [TeacherResolver],
  controllers: [TrainingController],
})
export class SchoolModule {}
