import { promises as fs } from 'fs';
import path from 'path';

// 可以重复键的白名单
const whitelist = ['_comment']

// 读取多个 JSON 文件并合并，检测重复键
export async function loadAndMergeJsonFiles(fileNames) {
    const dirName = './config'; // 配置文件所在目录
    let mergedConfig = {};
    const seenKeys = new Set(); // 用于跟踪已见键

    return new Promise(async (resolve, reject) => {
        for (const fileName of fileNames) {
            const filePath = path.join(dirName, fileName);
            try {
                // 使用 fs.stat 检查文件是否存在
                await fs.stat(filePath); // 检查文件是否存在

                // 读取文件内容
                const fileData = await fs.readFile(filePath, 'utf-8');
                const jsonData = JSON.parse(fileData);

                // 检查重复键
                for (const key in jsonData) {
                    if (seenKeys.has(key)&& !whitelist.includes(key)) {
                        // 如果发现重复键，拒绝 Promise
                        return reject(`发现重复的键: ${key} in file ${fileName}`);
                    } else {
                        seenKeys.add(key);
                        mergedConfig[key] = jsonData[key]; // 合并键值对
                    }
                }
            } catch (error) {
                return reject(`读取文件 ${fileName}: ${error.message}`);
            }
        }

        // 如果成功，解析合并后的配置
        resolve(mergedConfig);
    });
}