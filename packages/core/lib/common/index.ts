import path from "path";
import Logger from "../logging";
/**
 * 写入文件
 * @param fileName - 文件名
 * @param outputDir - 输出目录
 * @param content - 文件内容
 */
export async function writeFile(
  fileName: string,
  outputDir: string,
  content: string
): Promise<void> {
  const fs = await import("fs");
  const _outputDir = path.resolve(process.cwd(), outputDir);
  const filePath = path.join(_outputDir, fileName);
  // 确保目录存在
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  // 写入文件
  await fs.promises.writeFile(filePath, content, "utf8");
  Logger.info(`代码写入成功: ${filePath}`);
}
