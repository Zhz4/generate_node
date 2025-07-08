import fs from "fs";
import path from "path";
import logging from "../logging";
import { Template } from "@core/types";

/**
 * 替换变量
 * @param template - 模版配置
 * @param  config - 配置数据
 * @returns  处理后的模版配置
 */
export function replaceVariables(
  template: Template,
  config: Record<string, unknown>
) {
  const result = { ...template };
  // 替换输出文件名中的变量
  if (result.outputName) {
    result.outputName = interpolateString(result.outputName, config);
  }
  return result;
}

/**
 * 字符串插值
 * @param  str - 原始字符串
 * @param data - 数据对象
 * @returns 插值后的字符串
 */
export function interpolateString(str: string, data: Record<string, unknown>) {
  return str.replace(/\$\{([^}]+)\}/g, (match: string, key: string) => {
    return (data[key] as string) || match;
  });
}

/**
 * 复制目录
 * @param src - 源目录路径
 * @param dest - 目标目录路径
 */
export async function copyDirectory(src: string, dest: string) {
  await fs.promises.mkdir(dest, { recursive: true });
  const files = await fs.promises.readdir(src);

  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = await fs.promises.stat(srcPath);

    if (stat.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
      logging.info(`初始化文件 ${destPath}`);
    }
  }
}

/**
 * 检查文件是否存在（同步）
 * @param filePath - 文件路径
 * @returns 文件是否存在
 */
export function fileExistsSync(filePath: string): boolean {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * 检查文件是否存在（异步）
 * @param filePath - 文件路径
 * @returns 文件是否存在
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}
