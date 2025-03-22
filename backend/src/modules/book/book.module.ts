// backend/src/modules/book/book.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookEntity } from './book.entity';
import { AuthorEntity } from '../author/author.entity';
import { ReviewEntity } from '../review/review.entity'; // Add this import
import { BookRepository } from './book.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity, AuthorEntity, ReviewEntity]), // Add ReviewEntity here
  ],
  controllers: [BookController],
  providers: [BookService, BookRepository],
  exports: [BookRepository, TypeOrmModule], // <-- Export TypeOrmModule too
})
export class BookModule {}
