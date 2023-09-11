import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

import { Transform } from 'class-transformer';

export class UpdateBookDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @Min(0)
  @Max(5)
  @IsNumber()
  @Transform(({ value }) => (typeof value === 'string' ? Number(value) : 0))
  rating: number;

  @Min(0)
  @Max(1000)
  @IsNumber()
  @Transform(({ value }) => (typeof value === 'string' ? Number(value) : 0))
  price: number;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  authorId: string;
}
