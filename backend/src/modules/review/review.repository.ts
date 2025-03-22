import { Repository } from 'typeorm';
import { ReviewEntity } from './review.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>
  ) {}

  public create(reviewData: Partial<ReviewEntity>): ReviewEntity {
    return this.reviewRepository.create(reviewData);
  }

  public async saveReview(review: ReviewEntity): Promise<ReviewEntity> {
    return this.reviewRepository.save(review);
  }

  public async findReviewsForBook(
    bookId: string,
    order: 'ASC' | 'DESC'
  ): Promise<ReviewEntity[]> {
    return this.reviewRepository.find({
      where: { book: { id: bookId } },
      order: { createdAt: order },
    });
  }
}
