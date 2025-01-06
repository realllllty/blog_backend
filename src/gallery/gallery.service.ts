import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ResultData } from "src/common/utils/result";
import { GalleryList } from "./entities/galleryList.entity";
import { Picture } from "./entities/picture.entity";
import { CreateGalleryDto } from "./dto/create-gallery.dto";

@Injectable()
export class GalleryService {

    constructor(
        @InjectRepository(GalleryList)
        private galleryListRepository: Repository<GalleryList>,
        @InjectRepository(Picture)
        private pictureRepository: Repository<Picture>,
    ) { }

    // 创建一个新的GalleryList
    async createGallery(createGalleryDto: CreateGalleryDto): Promise<ResultData> {
        const { name, urls } = createGalleryDto;

        // 创建新的GalleryList实例
        const gallery = new GalleryList();
        gallery.name = name;
        // 选择第一个URL作为集合主图URL
        gallery.url = urls[0];

        // 创建Picture实例数组
        const pictures = urls.map(url => {
            const picture = new Picture();
            picture.url = url;
            return picture;
        });

        // 设置双向关系
        gallery.picture = pictures;
        pictures.forEach(picture => picture.galleryList = gallery);

        // 保存到数据库，cascade: true 会自动保存关联的Picture
        await this.galleryListRepository.save(gallery);
        return ResultData.ok();
    }

    // 删除一个GalleryList
    async removeGallery(name: string): Promise<ResultData> {
        const gallery = await this.galleryListRepository.findOneOrFail({ where: { name }, relations: ['picture'] });
        await this.galleryListRepository.remove(gallery);
        return ResultData.ok();
    }

    async getGalleryList(): Promise<ResultData> {
        const galleryList = await this.galleryListRepository.find();
        return ResultData.ok(galleryList);
    }

    async getPicturesByGalleryID(galleryID: string): Promise<ResultData> {
        const pictures = await this.galleryListRepository
            .createQueryBuilder('galleryList')
            // (主表实体的字段路径用于定义关联关系, 为关联表起的别名, 条件(condition 参数只影响 SQL 的 ON 子句))
            .leftJoinAndSelect('galleryList.picture', 'picture')
            .where('galleryList.id = :id', { id: galleryID })
            .getMany();
        return ResultData.ok(pictures[0].picture);
    }
}
