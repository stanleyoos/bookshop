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
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDTO } from './dtos/create-author.dto';
import { UpdateAuthorDTO } from './dtos/update-author.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  @Get('/')
  getAll() {
    return this.authorsService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const author = await this.authorsService.getById(id);
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }

  @Post('/')
  public createAuthor(@Body() authorData: CreateAuthorDTO) {
    return this.authorsService.createAuthor(authorData);
  }

  @Put('/:id')
  async updateAuthor(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() authorData: UpdateAuthorDTO,
  ) {
    if (!(await this.authorsService.getById(id))) {
      throw new NotFoundException('Author not found');
    }

    await this.authorsService.updateAuthor(id, authorData);
    return { success: true };
  }

  @Delete('/:id')
  async deleteAuthor(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.authorsService.getById(id))) {
      throw new NotFoundException('Product not found');
    }
    await this.authorsService.deleteAuthor(id);
    return { success: true };
  }
}
