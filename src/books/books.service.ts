import { Book } from '@prisma/client';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}

  public getAll(): Promise<Book[]> {
    return this.prismaService.book.findMany({
      include: { author: true },
    });
  }

  public getById(id: Book['id']): Promise<Book | null> {
    return this.prismaService.book.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  public deleteBook(id: Book['id']): Promise<Book> {
    return this.prismaService.book.delete({
      where: { id },
    });
  }

  public async createBook(
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    try {
      const { authorId, ...otherData } = bookData;

      return await this.prismaService.book.create({
        data: {
          ...otherData,
          author: {
            connect: { id: authorId },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Title is already taken');

      if (error.code === 'P2025')
        throw new BadRequestException("Author doesn't exist");
      throw error;
    }
  }

  public async updateBook(
    id: Book['id'],
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    try {
      const { authorId, ...otherData } = bookData;
      return this.prismaService.book.update({
        where: { id },
        data: {
          ...otherData,
          author: {
            connect: { id: authorId },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Title is already taken');

      if (error.code === 'P2025')
        throw new BadRequestException("Author doesn't exist");
      console.log(error);
      throw error;
    }
  }
}
