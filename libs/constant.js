import fs from 'fs-extra';
import path from 'path';
import {fileURLToPath} from 'url';
const __filenameNew = fileURLToPath(import.meta.url);
const __dirnameNew = path.dirname(__filenameNew);
// 根目录
export const rootPath = __dirnameNew.slice(0, __dirnameNew.length - 4);

// 获取package.json文件内容
export const packageJsonData = JSON.parse(fs.readFileSync(`${rootPath}package.json`, 'utf8'));

// 获取当前模板列表
export const questionList = JSON.parse(fs.readFileSync(`${rootPath}libs/data/demo.config.json`, 'utf8'));

// vue插件配置
export const vueConfigList = JSON.parse(fs.readFileSync(`${rootPath}libs/data/vue.config.json`, 'utf8'));
// react 插件配置
export const reactConfigList = JSON.parse(fs.readFileSync(`${rootPath}libs/data/react.config.json`, 'utf8'));

// vue-package-template 插件配置
export const vuePackageTemplateConfigList = JSON.parse(
    fs.readFileSync(`${rootPath}libs/data/vue-package-template.json`, 'utf8')
);
// react-package-template 插件配置

export const reactPackageTemplateConfigList = JSON.parse(
    fs.readFileSync(`${rootPath}libs/data/react-package-template.json`, 'utf8')
);
