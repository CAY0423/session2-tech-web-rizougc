import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorPresenter } from './author.presenter';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  public async create(
    @Body() createAuthorDto: CreateAuthorDto
  ): Promise<AuthorPresenter> {
    // log basic info and full json of the new author data
    console.log(`Request received to create a new author.`);
    console.log(`Author data: ${JSON.stringify(createAuthorDto, null, 2)}`);

    return this.authorService
      .createAuthor(createAuthorDto)
      .then((author: AuthorPresenter) => {
        console.log(`Author created successfully with id: ${author.id}`);
        return author;
      })
      .catch((error: Error) => {
        console.error(`Error creating author: ${error.message}`);
        throw error;
      });
  }

  @Get()
  public async findAll(): Promise<AuthorPresenter[]> {
    console.log('Request received to fetch all authors');

    return this.authorService
      .getAuthors()
      .then((authors: AuthorPresenter[]) => {
        // log a summary of the fetched authors, not full details
        console.log(`Fetched ${authors.length} authors.`);

        return authors;
      })
      .catch((error: Error) => {
        console.error(`Error fetching authors: ${error.message}`);
        throw error;
      });
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<AuthorPresenter> {
    console.log(`Request received to fetch author with id: "${id}"`);

    try {
      const author = await this.authorService.getAuthorById(id);
      if (!author) {
        console.warn(`Author with id "${id}" not found`);
        throw new NotFoundException('Author not found');
      }
      // log the full details of the author if found
      console.log(`Author found: ${JSON.stringify(author, null, 2)}`);
      return author;
    } catch (error) {
      console.error(`Error fetching author with id "${id}": ${error.message}`);
      throw error;
    }
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<{ message: string }> {
    console.log(`Request received to delete author with id: "${id}"`);

    try {
      const result = await this.authorService.deleteAuthor(id);
      console.log(`Author with id "${id}" deleted successfully.`);
      return result;
    } catch (error) {
      console.error(`Error deleting author with id "${id}": ${error.message}`);
      throw error;
    }
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto
  ): Promise<AuthorPresenter> {
    // log update request with id and partial data provided
    console.log(`Request received to update author with id: "${id}"`);
    console.log(`Update data: ${JSON.stringify(updateAuthorDto, null, 2)}`);

    try {
      const updatedAuthor = await this.authorService.updateAuthor(
        id,
        updateAuthorDto
      );
      console.log(`Author with id "${id}" updated successfully.`);
      return updatedAuthor;
    } catch (error) {
      console.error(`Error updating author with id "${id}": ${error.message}`);
      throw error;
    }
  }
}
