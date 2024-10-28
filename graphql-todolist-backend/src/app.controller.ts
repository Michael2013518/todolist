import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateTodolistDto } from './dto/Create-todolist.dto';
import { UpdateTodolistDto } from './dto/Update-todolist.dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create')
  async createTodoItem(@Body() todoItem: CreateTodolistDto) {
    return this.appService.create(todoItem);
  }
  @Post('update')
  async updateTodoItem(@Body() todoItem: UpdateTodolistDto) {
    return this.appService.update(todoItem);
  }
  @Get('delete')
  async deleteTodoItem(@Query('id') id: string) {
    return this.appService.delete(+id);
  }
  @Get('list')
  async getTodoList() {
    return this.appService.query();
  }
  getHello(): string {
    return this.appService.getHello();
  }
}
