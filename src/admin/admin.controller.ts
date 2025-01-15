import { Controller, Get, Post, Body, Delete, Param, Put } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateGalleryDto } from "../gallery/dto/create-gallery.dto";
import { UpdateGalleryDto } from "../gallery/dto/update-gallery.dto";
import { CreateArticleDto } from "src/article/dto/create-article.dto";
import { ResultData } from "src/common/utils/result";
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
    async deleteGallery(@Body() data: { id: string }) {
        if (data && Object.keys(data).length > 0) {
            return this.adminService.removeGallery(data.id);
        }
        return ResultData.fail(0, 'id is required');
    }

    @Delete('gallery/:galleryId/picture/:pictureId')
    async removePicture(
        @Param('galleryId') galleryId: string,
        @Param('pictureId') pictureId: string
    ) {
        return this.adminService.removePicture(galleryId, pictureId);
    }

    @Post('create-blog')
    async createArticle(@Body() createArticleDto: CreateArticleDto) {
        return this.adminService.createArticle(createArticleDto);
    }

    @Put('update-gallery')
    async updateGallery(@Body() updateGalleryDto: UpdateGalleryDto) {
        return this.adminService.updateGallery(updateGalleryDto);
    }
}
