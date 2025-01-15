import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Picture } from './picture.entity';

@Entity('gallery_list')
export class GalleryList {
    // PrimaryGeneratedColumn创建一个主列
    @PrimaryGeneratedColumn({ comment: '图片集合主键' })
    id: string;

    @Column({ comment: '图片集合名称' })
    name: string;

    @Column({ comment: '集合主图URL' })
    url: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', comment: '创建时间' })
    createdAt: Date;

    @Column({ comment: '图片数量', default: 0 })
    pictureCount: number;

    @OneToMany(() => Picture, picture => picture.galleryList, {
        cascade: true
    })
    picture: Picture[];
}