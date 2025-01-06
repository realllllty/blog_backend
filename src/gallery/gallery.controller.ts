import { Controller, Get, HttpCode, Query, Request } from '@nestjs/common';
import { GalleryService } from './gallery.service'; 

@Controller('gallery')
export class GalleryController {
    constructor(private readonly galleryService: GalleryService) {}

    // 获取照片集列表, 设置请求成功过后的状态码为200
    @Get('list')
    @HttpCode(200)
    async getArticleList(@Request() req) {
        return await this.galleryService.getGalleryList();
    }

    // 根据照片集名称获取照片集下的照片列表
    @Get('pictures/:id')
    @HttpCode(200)
    async getPicturesByGalleryName(@Request() req) {
        const { id } = req.params;
        return await this.galleryService.getPicturesByGalleryID(id);
    }
}
