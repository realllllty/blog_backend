import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { ArticleEntity } from "./entities/article.entity";
import { ResultData } from "src/common/utils/result";
import { CreateArticleDto } from "src/article/dto/create-article.dto";


@Injectable()
export class ArticleService {

    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepo: Repository<ArticleEntity>,
    ) { }

    async getArticleList() {
        const data = await this.articleRepo.find();
        return ResultData.ok(data);
    }

    async getArticleByTitle(title: string) {
        const articles = await this.articleRepo.find(
            {
                where: { title: title }
            }
        );

        if (!articles) {
            return ResultData.fail(0, '文章不存在');
        } else {
            return ResultData.ok(articles[0].content);
        }

    }

    async createArticle(createArticleDto: CreateArticleDto) {
        const article = new ArticleEntity();
        article.title = createArticleDto.title;
        article.content = createArticleDto.content;
        await this.articleRepo.save(article);
        return ResultData.ok();
    }
}