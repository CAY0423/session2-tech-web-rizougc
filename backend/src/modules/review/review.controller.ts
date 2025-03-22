import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewEntity } from './review.entity';

@Controller('books/:bookId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  public async createReview(
    @Param('bookId') bookId: string,
    @Body() createReviewDto: CreateReviewDto
  ): Promise<ReviewEntity> {
    console.log(`Request received to create a review for bookId: "${bookId}"`);
    console.log(`Review data: ${JSON.stringify(createReviewDto, null, 2)}`);

    return this.reviewService
      .createReview(bookId, createReviewDto)
      .then((review: ReviewEntity) => {
        console.log(`Review created with id: ${review.id}`);
        return review;
      })
      .catch((error: Error) => {
        console.error(
          `Error creating review for bookId "${bookId}": ${error.message}`
        );
        throw error;
      });
  }

  @Get()
  public async getReviews(
    @Param('bookId') bookId: string,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC'
  ): Promise<ReviewEntity[]> {
    console.log(
      `Request received to fetch reviews for bookId: "${bookId}" with order: "${order}"`
    );

    return this.reviewService
      .getReviewsForBook(bookId, order)
      .then((reviews: ReviewEntity[]) => {
        console.log(
          `Fetched ${reviews.length} reviews for bookId: "${bookId}"`
        );
        if (reviews.length > 0) {
          console.log(`Sample review: ${JSON.stringify(reviews[0], null, 2)}`);
        }
        return reviews;
      })
      .catch((error: Error) => {
        console.error(
          `Error fetching reviews for bookId "${bookId}": ${error.message}`
        );
        throw error;
      });
  }
}
