import { IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  name: string;

  type: string;

  @IsString()
  description: string;

  url: string;
}
