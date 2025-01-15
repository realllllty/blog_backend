import { Picture } from "../entities/picture.entity";
export class CreateGalleryDto {
    name: string;
    pictures: Picture[];
}
