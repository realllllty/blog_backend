import * as fs from 'fs';
// 导入path模块, 并将所有导出成员绑定到名为path的变量上
import * as path from 'path';

const configFileNameObj = {
    development: 'dev',
    test: 'test',
    production: 'prod',
};

let config;

const env = process.env.NODE_ENV || 'development';
const configFileName = configFileNameObj[env];
const configFilePath = path.resolve(__dirname, `${configFileName}_config.json`);

try {
    const configFileContent = fs.readFileSync(configFilePath, 'utf-8');
    // 需要提前在nest-cli当中配置相关json文件到assets当中(否则dist将不会包含目标文件)
    config = JSON.parse(configFileContent);
} catch (error) {
    console.error(`Error reading config file: ${error.message}`);
}

// let config;

// (async () => {
//     try {
//         const module = await import(configFilePath);
//         config = module.default;
//         console.log(config);
//     } catch (error) {
//         console.error(`Error loading config file: ${error.message}`);
//     }
// })();

export default () => {
    return config;
}
