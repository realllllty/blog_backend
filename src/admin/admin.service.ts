import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Cloudflare } from "cloudflare";
import { GalleryService } from "../gallery/gallery.service";
import { CreateGalleryDto } from "../gallery/dto/create-gallery.dto";
import { UpdateGalleryDto } from "../gallery/dto/update-gallery.dto";
import { ResultData } from "src/common/utils/result";
import { ArticleService } from '../article/article.service';
import { CreateArticleDto } from "src/article/dto/create-article.dto";
import { UpdateArticleDto } from "src/article/dto/update-article.dto";

@Injectable()
export class AdminService {
    constructor(
        private configService: ConfigService,
        private galleryService: GalleryService,
        private articleService: ArticleService,
    ) {}

    async getTemporaryCredential() {
        const accountId = this.configService.get('cloudflare.r2.account_id');
        const bucket = this.configService.get('cloudflare.r2.bucket');
        const parentAccessKeyId = this.configService.get('cloudflare.r2.parentAccessKeyId');
        const apiKey = this.configService.get('cloudflare.client.apiKey');
        const apiEmail = this.configService.get('cloudflare.client.apiEmail');
        if (!accountId || !bucket || !parentAccessKeyId) {
            throw new Error('Cloudflare R2 configuration is missing');
        }
        const client = new Cloudflare({
            apiKey: apiKey,
            apiEmail: apiEmail,
        });
        try {
            const temporaryCredential = await client.r2.temporaryCredentials.create({
            account_id: accountId,
            bucket: bucket,
            parentAccessKeyId: parentAccessKeyId,
            permission: 'admin-read-write',
            ttlSeconds: 3600,
            });
            return ResultData.ok(temporaryCredential);
        } catch (error) {
            return ResultData.fail(0, 'Cloudflare R2 temporary credential creation failed');
        }
    }

    async createGallery(createGalleryDto: CreateGalleryDto): Promise<ResultData> {
        return this.galleryService.createGallery(createGalleryDto);
    }

    async removeGallery(name: string): Promise<ResultData> {
        return this.galleryService.removeGallery(name);
    }

    async createArticle(createArticleDto: CreateArticleDto): Promise<ResultData> {
        return this.articleService.createArticle(createArticleDto);
    }

    async removePicture(galleryId: string, pictureId: string): Promise<ResultData> {
        return this.galleryService.removePicture(galleryId, pictureId);
    }

    async updateGallery(updateGalleryDto: UpdateGalleryDto): Promise<ResultData> {
        return this.galleryService.updateGallery(updateGalleryDto);
    }

    async updateArticle(updateArticleDto: UpdateArticleDto): Promise<ResultData> {
        return this.articleService.updateArticle(updateArticleDto);
    }

    async removeArticle(id: string): Promise<ResultData> {
        return this.articleService.removeArticle(id);
    }
}
