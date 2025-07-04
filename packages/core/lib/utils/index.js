import fs from "fs";
import path from "path";
import logging from "../logging";

/**
 * 替换变量
 * @param {Object} template - 模版配置
 * @param {Object} config - 配置数据
 * @returns {Object} - 处理后的模版配置
 */
export function replaceVariables(template, config) {
  const result = { ...template };
  // 替换输出文件名中的变量
  if (result.outputName) {
    result.outputName = interpolateString(result.outputName, config);
  }
  return result;
}

/**
 * 字符串插值
 * @param {string} str - 原始字符串
 * @param {Object} data - 数据对象
 * @returns {string} - 插值后的字符串
 */
export function interpolateString(str, data) {
  return str.replace(/\$\{([^}]+)\}/g, (match, key) => {
    return data[key] || match;
  });
}

/**
 * 复制目录
 * @param {string} src - 源目录路径
 * @param {string} dest - 目标目录路径
 */
export async function copyDirectory(src, dest) {
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
