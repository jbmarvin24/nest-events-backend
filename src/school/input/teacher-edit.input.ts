import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { TeacherAddInput } from './teacher-add.input';

@InputType()
export class TeacherEditInput extends PartialType(
  // If you want to disable edit to some fields
  OmitType(TeacherAddInput, ['gender']),
) {}
