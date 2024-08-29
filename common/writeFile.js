import { promises as fs } from 'fs';
import path from 'path';

export default async function outFile(outputName, writeFileContent) {
    // 固定的文件夹名
    const dirName = './output';

    try {
        // 创建文件夹（如果不存在的话）
        await fs.mkdir(dirName, { recursive: true });

        // 将文件路径与文件夹结合
        const fullPath = path.join(dirName, outputName);

        // 解析目录路径并创建所需的子目录
        const dirPath = path.dirname(fullPath);
        await fs.mkdir(dirPath, { recursive: true });

        // 在指定的文件夹中写入文件
        await fs.writeFile(fullPath, writeFileContent, 'utf8');
        console.log(`文件写入成功，文件路径： ${fullPath}`);
    } catch (error) {
        console.error('文件写入失败:', error);
    }
}
