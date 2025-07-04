import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export default async function useReadModules() {
    // 获取当前模块的目录
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // 获取 modules 目录的路径
    const modulesDir = path.join(__dirname, '../modules');

    // 存储所有导入的模块
    const allModules = [];

    const importModules = async () => {
        // 读取 modules 目录下的所有文件
        const files = fs.readdirSync(modulesDir);

        for (const file of files) {
            // 只处理 .js 文件
            if (file.endsWith('.js')) {
                const modulePath = path.join(modulesDir, file);
                const moduleURL = new URL(`file://${modulePath.replace(/\\/g, '/')}`); // 转换为有效的 file URL

                // 导入模块
                const module = await import(moduleURL.href); // 使用动态导入

                allModules.push(module.default); // 假设导出的对象是 default
            }
        }
    };

    return new Promise((resolve, reject) => {
        importModules().then(() => {
            resolve(allModules); 
        }).catch(err => {
            console.error('Error importing modules:', err);
            reject(err);
        });
    });
}
