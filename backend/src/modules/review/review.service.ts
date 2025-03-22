import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { BookRepository } from '../book/book.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewEntity } from './review.entity';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly bookRepository: BookRepository
  ) {}

  public async createReview(
    bookId: string,
    createReviewDto: CreateReviewDto
  ): Promise<ReviewEntity> {
    const book = await this.bookRepository.findBookById(bookId);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const review: ReviewEntity = this.reviewRepository.create({
      ...createReviewDto,
      book,
    });

    return this.reviewRepository.saveReview(review);
  }

  public async getReviewsForBook(
    bookId: string,
    order: 'ASC' | 'DESC'
  ): Promise<ReviewEntity[]> {
    return this.reviewRepository.findReviewsForBook(bookId, order);
  }
}
