import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepository } from './review.repository';
import { ReviewEntity } from './review.entity';
import { BookModule } from '../book/book.module';
import { BookEntity } from '../book/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, BookEntity]), BookModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository],
})
export class ReviewModule {}
