import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { GalleryList } from './galleryList.entity';

@Entity('picture')
export class Picture {
    // PrimaryGeneratedColumn创建一个主列
    @PrimaryGeneratedColumn({ comment: '图片主键' })
    id: string;

    @Column({ comment: '图片URL' })
    url: string;

    @Column({ 
        comment: '图片描述',
        nullable: true
    })
    desc: string;

    @ManyToOne(
        () => GalleryList, 
        galleryList => galleryList.picture,
        {
            onDelete: 'CASCADE'
        } 
    )
    galleryList: GalleryList;
}