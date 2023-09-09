import { Injectable } from '@nestjs/common';
import { Author } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class AuthorsService {
  constructor(private prismaService: PrismaService) {}

  public getAll(): Promise<Author[]> {
    return this.prismaService.author.findMany();
  }

  public getById(id: Author['id']): Promise<Author | null> {
    return this.prismaService.author.findUnique({
      where: { id },
    });
  }
}
