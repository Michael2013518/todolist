import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateTodolistDto } from './dto/Create-todolist.dto';
import { UpdateTodolistDto } from './dto/Update-todolist.dto';
@Injectable()
export class AppService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  async query() {
    return await this.prismaService.todoItem.findMany({
      select: {
        id: true,
        content: true,
        createTime: true,
        updateTime: true,
      },
    });
  }
  async create(todoItem: CreateTodolistDto) {
    return await this.prismaService.todoItem.create({
      data: todoItem,
      select: {
        id: true,
        content: true,
        createTime: true,
        updateTime: true,
      },
    });
  }
  async update(todoItem: UpdateTodolistDto) {
    return await this.prismaService.todoItem.update({
      where: {
        id: todoItem.id,
      },
      data: todoItem,
      select: {
        id: true,
        content: true,
        createTime: true,
        updateTime: true,
      },
    });
  }
  async delete(id: number) {
    return await this.prismaService.todoItem.delete({
      where: {
        id: id,
      },
    });
  }
  getHello(): string {
    return 'Hello World!';
  }
}
