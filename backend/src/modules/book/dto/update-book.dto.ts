// update-book.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  publicationYear?: number;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @IsNumber()
  price?: number;
}
