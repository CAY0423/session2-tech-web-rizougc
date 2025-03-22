import { Injectable } from '@nestjs/common';
import { Repository, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorEntity } from './author.entity';
import { ReviewEntity } from '../review/review.entity';
import { BookEntity } from '../book/book.entity';

@Injectable()
export class AuthorRepository {
  constructor(
    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,

    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,

    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>
  ) {}

  public async getWeightedAverageRatingForAuthor(
    authorId: string
  ): Promise<number | null> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'weightedAverage')
      .innerJoin('review.book', 'book')
      .where('book.authorId = :authorId', { authorId })
      .getRawOne();

    return result && result.weightedAverage
      ? parseFloat(result.weightedAverage)
      : null;
  }

  public async findAuthorsWithWeightedRatings(): Promise<AuthorEntity[]> {
    const authors: AuthorEntity[] = await this.authorRepository.find({
      where: { name: Not('Deleted author') },
      relations: ['books'],
    });
    for (const author of authors) {
      author['weightedAverageRating'] =
        await this.getWeightedAverageRatingForAuthor(author.id);
    }
    return authors;
  }

  public async saveAuthor(author: AuthorEntity): Promise<AuthorEntity> {
    return this.authorRepository.save(author);
  }

  public async findAuthors(): Promise<AuthorEntity[]> {
    return this.authorRepository.find({
      where: { name: Not('Deleted author') },
      relations: ['books'],
    });
  }

  public async findAuthorById(id: string): Promise<AuthorEntity | null> {
    return this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });
  }

  public async findDeletedAuthor(): Promise<AuthorEntity | null> {
    return this.authorRepository.findOne({
      where: { name: 'Deleted author' },
    });
  }

  public async deleteAuthor(author: AuthorEntity): Promise<AuthorEntity> {
    return this.authorRepository.remove(author);
  }

  public async saveBook(book: BookEntity): Promise<BookEntity> {
    return this.bookRepository.save(book);
  }

  public create(authorData: Partial<AuthorEntity>): AuthorEntity {
    return this.authorRepository.create(authorData);
  }
}
