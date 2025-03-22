import { BookEntity } from './book.entity';

export class BookPresenter {
  constructor(
    public id: string,
    public title: string,
    public publicationYear: number,
    public price?: number,
    public author?: { id: string; name: string },
    public averageRating?: number
  ) {}

  public static fromEntity(book: BookEntity): BookPresenter {
    return new BookPresenter(
      book.id,
      book.title,
      book.publicationYear,
      book.price,
      book.author ? { id: book.author.id, name: book.author.name } : undefined,
      book['averageRating']
    );
  }
}
