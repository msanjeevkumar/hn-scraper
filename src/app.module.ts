import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Post } from './post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 54324,
      username: 'hn-scraper',
      password: 'Scraper123',
      database: 'hn-scraper',
      entities: [Post],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Post]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
