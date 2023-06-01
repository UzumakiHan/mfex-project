import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';

const {existsSync, statSync, readdirSync, rmdirSync, unlinkSync} = fs;
/**
 * 文件读写操作
 * @param {string} targetDir 当期目录
 * @param {string} filename  文件名
 * @param {object} answer 回答
 */
export function fileControl(targetDir, filename, answer) {
    fs.readFile(path.join(targetDir, filename)).then(res => {
        const str = res.toString();
        const html = ejs.render(str, answer);
        fs.writeFile(path.join(targetDir, filename), html);
    });
}

/**
 * 判断是否有同名文件夹
 * @param {string} projectName  文件名
 */
export const isFileExist = projectName => {
    const targetDir = path.join(process.cwd(), projectName);
    return fs.existsSync(targetDir);
};
/* path:文件名 */
export function delPath(pathFile) {
    if (!existsSync(pathFile)) {
        console.log('路径不存在');
        return '路径不存在';
    }
    const info = statSync(pathFile);
    if (info.isDirectory()) {
        // 目录
        const data = readdirSync(pathFile);
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                delPath(`${pathFile}/${data[i]}`); // 使用递归
                if (i === data.length - 1) {
                    // 删了目录里的内容就删掉这个目录
                    delPath(`${pathFile}`);
                }
            }
        } else {
            rmdirSync(pathFile); // 删除空目录
            return true;
        }
    } else if (info.isFile()) {
        unlinkSync(pathFile); // 删除文件
        return true;
    }
}
