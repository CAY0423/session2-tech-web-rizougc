import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from './book.entity';
import { AuthorEntity } from '../author/author.entity';
import { ReviewEntity } from '../review/review.entity';

@Injectable()
export class BookRepository {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,

    @InjectRepository(AuthorEntity)
    private readonly authorRepository: Repository<AuthorEntity>,

    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>
  ) {}

  public async saveBook(book: BookEntity): Promise<BookEntity> {
    return this.bookRepository.save(book);
  }

  public async findBooks(): Promise<BookEntity[]> {
    return this.bookRepository.find({
      relations: ['author'],
      select: ['id', 'title', 'publicationYear', 'price'],
    });
  }

  public async findBookById(id: string): Promise<BookEntity | null> {
    return this.bookRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  public async deleteBook(id: string): Promise<void> {
    await this.bookRepository.delete(id);
  }

  public async findAuthorById(authorId: string): Promise<AuthorEntity | null> {
    return this.authorRepository.findOne({ where: { id: authorId } });
  }

  public async getAverageRating(bookId: string): Promise<number | null> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avgRating')
      .where('review.bookId = :bookId', { bookId })
      .getRawOne();

    return result ? parseFloat(result.avgRating) : null;
  }

  public async findBooksWithRatings(): Promise<BookEntity[]> {
    const books = await this.bookRepository.find({ relations: ['author'] });
    for (const book of books) {
      book['averageRating'] = await this.getAverageRating(book.id);
    }
    return books;
  }

  public create(bookData: Partial<BookEntity>): BookEntity {
    return this.bookRepository.create(bookData);
  }
}
