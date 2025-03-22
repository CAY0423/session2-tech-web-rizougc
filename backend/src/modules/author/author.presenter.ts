import { AuthorEntity } from './author.entity';

export class AuthorPresenter {
  constructor(
    public id: string,
    public name: string,
    public bio?: string,
    public photo?: string,
    public bookCount?: number,
    public weightedAverageRating?: number,
    public books?: { id: string; title: string; publicationYear: number }[]
  ) {}

  public static fromEntity(author: AuthorEntity): AuthorPresenter {
    return new AuthorPresenter(
      author.id,
      author.name,
      author.bio,
      author.photo,
      author.books ? author.books.length : undefined,
      author['weightedAverageRating'],
      author.books
        ? author.books.map((book) => ({
            id: book.id,
            title: book.title,
            publicationYear: book.publicationYear,
          }))
        : undefined
    );
  }
}
