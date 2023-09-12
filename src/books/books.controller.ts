import { BooksService } from './books.service';

import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateBookDTO } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get('/')
  getAll() {
    return this.booksService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const book = await this.booksService.getById(id);
    if (!book) throw new NotFoundException('Book not found!');
    return book;
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteBook(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.booksService.getById(id))) {
      throw new NotFoundException('Book not found!');
    }
    await this.booksService.deleteBook(id);
    return { success: true };
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createBook(@Body() bookData: CreateBookDTO) {
    return this.booksService.createBook(bookData);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async updateBook(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() bookData: UpdateBookDTO,
  ) {
    if (!(await this.booksService.getById(id))) {
      throw new NotFoundException('Book not found');
    }

    await this.booksService.updateBook(id, bookData);
    return { success: true };
  }
}
