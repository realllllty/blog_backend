import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { GalleryModule } from '../gallery/gallery.module';
import { ArticleModule } from 'src/article/article.module';

@Module({
    imports: [GalleryModule, ArticleModule],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService],
})
export class AdminModule {}
