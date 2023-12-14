import { Controller, Get, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as excel from 'exceljs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('posts')
  async getPosts(@Query('format') format: string, @Res() res: Response) {
    const groupedPosts = await this.appService.getPosts();
    if (format?.toLowerCase() !== 'excel') {
      // Return JSON as the default or if the format is not 'excel'
      return res.json(groupedPosts);
    }

    const workbook = new excel.Workbook();

    Object.keys(groupedPosts).forEach((key) => {
      const sheet = workbook.addWorksheet(key);
      const posts = groupedPosts[key];
      if (posts.length > 0) {
        sheet.addRow(Object.keys(posts[0]));
      }

      posts.forEach((post) => {
        sheet.addRow(Object.values(post));
      });
    });

    const excelBuffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
    res.send(excelBuffer);
  }
}
