import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AuthorRepository } from './author.repository';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorPresenter } from './author.presenter';
import { AuthorEntity } from './author.entity';

@Injectable()
export class AuthorService {
  constructor(private readonly authorRepository: AuthorRepository) {}

  public async createAuthor(
    createAuthorDto: CreateAuthorDto
  ): Promise<AuthorPresenter> {
    const author: AuthorEntity = this.authorRepository.create(createAuthorDto);
    const savedAuthor: AuthorEntity =
      await this.authorRepository.saveAuthor(author);
    return AuthorPresenter.fromEntity(savedAuthor);
  }

  public async getAuthors(): Promise<AuthorPresenter[]> {
    const authors: AuthorEntity[] =
      await this.authorRepository.findAuthorsWithWeightedRatings();
    return authors.map((author: AuthorEntity) =>
      AuthorPresenter.fromEntity(author)
    );
  }

  public async getAuthorById(id: string): Promise<AuthorPresenter | null> {
    const author: AuthorEntity | null =
      await this.authorRepository.findAuthorById(id);
    if (!author) {
      return null;
    }
    return AuthorPresenter.fromEntity(author);
  }

  public async getDeletedAuthor(): Promise<AuthorEntity> {
    let deletedAuthor: AuthorEntity | null =
      await this.authorRepository.findDeletedAuthor();
    if (!deletedAuthor) {
      deletedAuthor = this.authorRepository.create({
        id: 'deleted-author',
        name: 'Deleted author',
        bio: 'This author has been deleted.',
      });
      await this.authorRepository.saveAuthor(deletedAuthor);
    }
    return deletedAuthor;
  }

  public async deleteAuthor(id: string): Promise<{ message: string }> {
    const author: AuthorEntity | null =
      await this.authorRepository.findAuthorById(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    if (author.name === 'Deleted author') {
      throw new BadRequestException('Cannot delete the "Deleted author".');
    }
    const deletedAuthor: AuthorEntity = await this.getDeletedAuthor();
    for (const book of author.books) {
      book.author = deletedAuthor;
      await this.authorRepository.saveBook(book);
    }
    await this.authorRepository.deleteAuthor(author);

    return {
      message:
        'Author deleted successfully and books reassigned to "Deleted author".',
    };
  }

  public async updateAuthor(
    id: string,
    updateAuthorDto: UpdateAuthorDto
  ): Promise<AuthorPresenter> {
    const author: AuthorEntity | null =
      await this.authorRepository.findAuthorById(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    Object.assign(author, updateAuthorDto);
    const updatedAuthor: AuthorEntity =
      await this.authorRepository.saveAuthor(author);
    return AuthorPresenter.fromEntity(updatedAuthor);
  }
}
