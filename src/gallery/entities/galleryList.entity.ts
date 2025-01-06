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

    @OneToMany(() => Picture, picture => picture.galleryList, {
        cascade: true
    })
    picture: Picture[];
}