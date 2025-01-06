import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('article')
export class ArticleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        comment: '文章标题',
        unique: true
    })
    title: string;

    @Column({
        type: 'longtext',
        comment: '文件内容' // 用于存储文章的具体内容，支持 Markdown 格式
    })
    content: string;

    @CreateDateColumn()
    createdAt: string;
}