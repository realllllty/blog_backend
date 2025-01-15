import { CreateGalleryDto } from "./create-gallery.dto";

export class UpdateGalleryDto extends CreateGalleryDto {
    // Gallery ID，如果提供则为更新，否则为新建
    id?: string;

    // 可选的头图URL，如果不提供则使用第一张图片的URL
    url?: string;
} 