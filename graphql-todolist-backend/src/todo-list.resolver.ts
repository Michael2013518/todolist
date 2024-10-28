import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { CreateTodolistDto, UpdateTodolistDto } from './dto/Todolist.dto';
import { PrismaService } from './prisma/prisma.service';
@Resolver()
export class TodoListResolver {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Query('todoList')
  async todolist() {
    return await this.prisma.todoItem.findMany({
      select: {
        id: true,
        content: true,
        createTime: true,
        updateTime: true,
      },
      orderBy: {
        createTime: 'desc',
      },
    });
  }

  @Query('queryById')
  async todoById(@Args('id') id: number) {
    return await this.prisma.todoItem.findUnique({
      where: {
        id: id,
      },
    });
  }

  @Mutation('addTodoItem')
  async createTodoItem(@Args('todoItem') todoItem: CreateTodolistDto) {
    return await this.prisma.todoItem.create({
      data: todoItem,
      select: {
        id: true,
        content: true,
        createTime: true,
      },
    });
  }

  @Mutation('updateTodoItem')
  async updateTodoItem(@Args('todoItem') todoItem: UpdateTodolistDto) {
    return await this.prisma.todoItem.update({
      where: {
        id: todoItem.id,
      },
      data: {
        content: todoItem.content,
      },
      select: {
        id: true,
        content: true,
        createTime: true,
      },
    });
  }

  @Mutation('deleteTodoItem')
  async deleteTodoItem(@Args('id') id: number) {
    return await this.prisma.todoItem.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
      },
    });
  }
}
