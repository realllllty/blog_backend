import { Controller, Get, Post, Body, Delete } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateGalleryDto } from "../gallery/dto/create-gallery.dto";
import { CreateArticleDto } from "src/article/dto/create-article.dto";

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('cloudflare-temporary-token')
    async getCloudflareTemporaryToken() {
        return this.adminService.getTemporaryCredential();
    }

    @Post('create-gallery')
    async createGallery(@Body() createGalleryDto: CreateGalleryDto) {
        return this.adminService.createGallery(createGalleryDto);
    }

    @Delete('delete-gallery')
    async deleteGallery(@Body('name') name: string) {
        return this.adminService.removeGallery(name);
    }

    @Post('create-blog')
    async createArticle(@Body() createArticleDto: CreateArticleDto) {
        return this.adminService.createArticle(createArticleDto);
    }
}
