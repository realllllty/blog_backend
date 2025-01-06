import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GalleryModule } from './gallery/gallery.module';
import { AdminModule } from './admin/admin.module';
import configuration from './config/index';

@Module({
    imports: [
        // 配置模块
        ConfigModule.forRoot({
            cache: true,
            load: [configuration],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            // 自定义提供器???工厂函数可以根据运行时的条件或依赖项来生成配置或实例。
            useFactory: (config: ConfigService) => {
                return {
                    type: 'mysql',
                    // TypeORM 将会在当前模块文件所在的目录及其所有子目录中，查找所有以 .entity 结尾且扩展名为 .ts 或 .js 的文件，并将这些文件作为实体文件加载。
                    entities: [`${__dirname}/**/*.entity{.ts,.js}`],
                    autoLoadEntities: true,
                    keepConnectionAlive: true,
                    timezone: '+08:00',
                    ...config.get('db.mysql'),
                } as TypeOrmModuleOptions;
            },
        }),
        ArticleModule,
        GalleryModule,
        AdminModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
