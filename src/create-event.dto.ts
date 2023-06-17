import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(5, 100)
  name: string;

  @IsString()
  @Length(5, 255)
  description: string;

  @IsDateString()
  when: string;

  @IsString()
  address: string;
}
