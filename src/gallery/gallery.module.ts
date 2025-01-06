import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryList } from './entities/galleryList.entity';
import { Picture } from './entities/picture.entity';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';

@Module({
    imports: [TypeOrmModule.forFeature([GalleryList, Picture])],
    controllers: [GalleryController],
    providers: [GalleryService],
    exports: [GalleryService],
})
export class GalleryModule {}
