import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ResultData } from "src/common/utils/result";
import { GalleryList } from "./entities/galleryList.entity";
import { Picture } from "./entities/picture.entity";
import { CreateGalleryDto } from "./dto/create-gallery.dto";
import { UpdateGalleryDto } from "./dto/update-gallery.dto";

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
        const { name, pictures: pictureList } = createGalleryDto;

        // 创建新的GalleryList实例
        const gallery = new GalleryList();
        gallery.name = name;
        // 选择第一个URL作为集合主图URL
        gallery.url = pictureList[0].url;
        // 设置图片数量
        gallery.pictureCount = pictureList.length;

        // 创建Picture实例数组
        const pictures = pictureList.map(pictureData => {
            const newPicture = new Picture();
            newPicture.url = pictureData.url;
            return newPicture;
        });

        // 设置双向关系
        gallery.picture = pictures;
        pictures.forEach(picture => picture.galleryList = gallery);

        // 保存到数据库，cascade: true 会自动保存关联的Picture
        await this.galleryListRepository.save(gallery);
        return ResultData.ok();
    }

    // 删除一个GalleryList
    async removeGallery(id: string): Promise<ResultData> {
        const gallery = await this.galleryListRepository.findOneOrFail({ where: { id }, relations: ['picture'] });
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

    // 弃用: 删除特定图片集合中的某张图片
    async removePicture(galleryID: string, pictureID: string): Promise<ResultData> {
        // 1. 查找并验证图片集合是否存在
        const gallery = await this.galleryListRepository.findOne({
            where: { id: galleryID },
            relations: ['picture']
        });

        if (!gallery) {
            return ResultData.fail(404, '图片集合不存在');
        }

        // 2. 查找并验证图片是否存在
        const picture = await this.pictureRepository.findOne({
            where: { id: pictureID, galleryList: { id: galleryID } }
        });

        if (!picture) {
            return ResultData.fail(404, '图片不存在或不属于该集合');
        }

        // 3. 删除图片
        await this.pictureRepository.remove(picture);

        // 4. 更新图片集合的图片数量
        gallery.pictureCount = gallery.pictureCount - 1;

        // 如果是最后一张图片，需要更新集合的主图URL
        if (gallery.pictureCount === 0) {
            gallery.url = '';
        } else if (gallery.url === picture.url) {
            // 如果删除的是主图，需要设置新的主图
            const firstPicture = await this.pictureRepository.findOne({
                where: { galleryList: { id: galleryID } }
            });
            gallery.url = firstPicture ? firstPicture.url : '';
        }

        // 5. 保存更新后的图片集合
        await this.galleryListRepository.save(gallery);

        return ResultData.ok();
    }

    // 更新或新增Gallery
    async updateGallery(updateGalleryDto: UpdateGalleryDto): Promise<ResultData> {
        const { id, name, pictures, url } = updateGalleryDto;

        // 如果没有提供id，则创建新的Gallery
        if (!id) {
            return this.createGallery(updateGalleryDto);
        }

        // 查找并验证图片集合是否存在
        const gallery = await this.galleryListRepository.findOne({
            where: { id },
            relations: ['picture']
        });

        if (!gallery) {
            return ResultData.fail(404, '图片集合不存在');
        }

        // 更新Gallery名称
        gallery.name = name;

        // 创建或复用Picture实例数组
        const updatedPictures = await Promise.all(pictures.map(async pictureData => {
            // 检查数据库中是否存在相同URL的图片
            let picture = await this.pictureRepository.findOne({
                where: { url: pictureData.url }
            });

            if (picture) {
                // 如果找到现有图片，更新描述
                if (pictureData.desc !== undefined) {
                    picture.desc = pictureData.desc;
                }
            } else {
                // 如果不存在，创建新的Picture实例
                picture = new Picture();
                picture.url = pictureData.url;
                picture.desc = pictureData.desc;
            }

            picture.galleryList = gallery;
            return picture;
        }));

        // 更新Gallery的图片
        gallery.picture = updatedPictures;
        gallery.pictureCount = pictures.length;

        // 设置头图URL，如果提供了自定义URL则使用，否则使用第一张图片的URL
        gallery.url = url || pictures[0].url;

        // 保存更新
        await this.galleryListRepository.save(gallery);
        return ResultData.ok();
    }
}
