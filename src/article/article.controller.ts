import { Controller, Get, HttpCode, Query, Request } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    // 获取文章列表, 设置请求成功过后的状态码为200
    @Get('list')
    @HttpCode(200)
    async getArticleList(@Request() req) {
        return await this.articleService.getArticleList();
    }

    // 获取文章详情, 设置请求成功过后的状态码为200
    @Get('detail/:name')
    @HttpCode(200)
    async getArticleDetail(@Request() req) {
        const { name } = req.params;
        return await this.articleService.getArticleByTitle(name);
    }
}
