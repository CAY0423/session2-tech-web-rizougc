import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto'; // Assurez-vous d'avoir un DTO de mise à jour
import { BookPresenter } from './book.presenter';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  public async create(
    @Body() createBookDto: CreateBookDto
  ): Promise<BookPresenter> {
    console.log(`Request received to create a new book.`);
    return this.bookService.createBook(createBookDto);
  }

  @Get()
  public async findAll(): Promise<BookPresenter[]> {
    console.log('Request received to fetch all books');
    return this.bookService.getBooks();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<BookPresenter> {
    console.log(`Request received to fetch book with id: "${id}"`);
    const book = await this.bookService.getBookById(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto
  ): Promise<BookPresenter> {
    console.log(`Request received to update book with id: "${id}"`);
    const updatedBook = await this.bookService.updateBook(id, updateBookDto);
    if (!updatedBook) throw new NotFoundException('Book not found');
    console.log(`Book updated successfully with id: "${id}"`);
    return updatedBook;
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<{ message: string }> {
    console.log(`Request received to delete book with id: "${id}"`);
    return this.bookService.deleteBook(id);
  }
}
