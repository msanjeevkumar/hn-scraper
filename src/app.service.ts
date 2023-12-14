import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {
    this.scrapeData().catch((err) => this.logger.error(err));
  }
  getHello(): string {
    return 'Hello World!';
  }

  async getPosts(): Promise<Record<string, any[]>> {
    const posts = await this.postsRepository.find({
      order: {
        lastUpdatedOn: 'DESC',
      },
    });
    const groupedPosts = {
      '0-100': [],
      '101-200': [],
      '201-300': [],
      '301-n': [],
    };
    posts.forEach((post) => {
      if (post.comments >= 0 && post.comments <= 100) {
        groupedPosts['0-100'].push(post);
      } else if (post.comments >= 101 && post.comments <= 200) {
        groupedPosts['101-200'].push(post);
      } else if (post.comments >= 201 && post.comments <= 300) {
        groupedPosts['201-300'].push(post);
      } else {
        groupedPosts['301-n'].push(post);
      }
    });

    return groupedPosts;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async scrapeData() {
    console.time('hn-scraped');
    this.logger.log('Scraping hacker news website');
    let index = 1;
    let posts = [];
    do {
      try {
        console.time('page ' + index);
        posts = await this.scrapeHackerNews(index);
      } catch (error) {
        this.logger.error(error);
      } finally {
        console.timeEnd('page ' + index);
        index++;
      }
    } while (posts.length > 0);

    this.logger.log('Scraped hacker news website successfully');
    console.timeEnd('hn-scraped');
  }

  async scrapeHackerNews(pageIndex: number = 1) {
    this.logger.log('Scraping hacker news page ' + pageIndex);
    const html = await this.getResponse(
      'https://news.ycombinator.com/?p=' + pageIndex,
    );
    const posts = this.getHnPosts(html);

    if (posts.length > 0) {
      await this.postsRepository.upsert(posts, ['id']);
    }

    this.logger.log('Scraped hacker news page ' + pageIndex);
    return posts;
  }
  getHnPosts(html: string) {
    const $ = cheerio.load(html);
    const posts = [];

    $('tr.athing').each((_, element) => {
      const id = parseInt($(element).attr('id'), 10);
      // const title = $(element).find('.titleline a').text()
      const title = $(element)
        .find('.titleline')
        .first()
        .children()
        .first()
        .text();
      const url = $(element).find('.titleline a').attr('href');
      const lastUpdatedOn = $(element)
        .next()
        .find('.subtext .age')
        .attr('title');
      const commentsText = $(element)
        .next()
        .find('.subtext a:last-child')
        .text();
      const commentIndex = commentsText.lastIndexOf('comment');
      const comments =
        commentIndex === -1
          ? 0
          : parseInt(
              commentsText.substring(
                commentsText.lastIndexOf('ago') + 3,
                commentIndex,
              ),
              10,
            );
      // const comments = parseInt($(element).next().find('.subtext a:last-child').text(), 10) || 0;
      // const comments = $(element).next().find('a[href="item?id='+id+'"]').text();

      const post = {
        id,
        title,
        lastUpdatedOn,
        url,
        comments,
      };

      posts.push(post);
    });

    return posts;
  }

  async getResponse(url: string) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url,
    };

    const { data } = await axios.request(config);
    return data;
  }
}
