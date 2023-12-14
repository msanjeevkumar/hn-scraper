import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('posts')
  async getPosts(@Res() res: Response) {
    const groupedPosts = await this.appService.getPosts();
    res.json(groupedPosts);
  }
}
