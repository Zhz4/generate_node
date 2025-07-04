import path from 'path';
import Logger from '../logging';
import { OUTPUT_DIR } from '../constants';
/**
   * 写入文件
   * @param {string} fileName - 文件名
   * @param {string} content - 文件内容
   * @returns {Promise<void>}
   */
export async function writeFile(fileName, content) {
    const fs = await import('fs');
    const outputDir = path.resolve(process.cwd(), OUTPUT_DIR);
    const filePath = path.join(outputDir, fileName);
    // 确保目录存在
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    // 写入文件
    await fs.promises.writeFile(filePath, content, 'utf8');
      Logger.info(`生成文件: ${filePath}`);
  }