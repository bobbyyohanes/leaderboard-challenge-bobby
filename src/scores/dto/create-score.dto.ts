import { IsInt, Min } from 'class-validator';

export class CreateScoreDto {
  @IsInt()
  @Min(0)
  value: number;
}
