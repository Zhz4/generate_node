import fs from 'fs';
import path from 'path';

/**
 * 文件工具类
 */
export class FileUtils {
  /**
   * 确保目录存在
   * @param {string} dirPath - 目录路径
   * @returns {Promise<void>}
   */
  static async ensureDir(dirPath) {
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  /**
   * 读取文件内容
   * @param {string} filePath - 文件路径
   * @param {string} encoding - 编码格式
   * @returns {Promise<string>} - 文件内容
   */
  static async readFile(filePath, encoding = 'utf8') {
    try {
      return await fs.promises.readFile(filePath, encoding);
    } catch (error) {
      throw new Error(`读取文件失败: ${filePath} - ${error.message}`);
    }
  }

  /**
   * 写入文件内容
   * @param {string} filePath - 文件路径
   * @param {string} content - 文件内容
   * @param {string} encoding - 编码格式
   * @returns {Promise<void>}
   */
  static async writeFile(filePath, content, encoding = 'utf8') {
    try {
      // 确保目录存在
      await this.ensureDir(path.dirname(filePath));
      
      // 写入文件
      await fs.promises.writeFile(filePath, content, encoding);
    } catch (error) {
      throw new Error(`写入文件失败: ${filePath} - ${error.message}`);
    }
  }

  /**
   * 检查文件是否存在
   * @param {string} filePath - 文件路径
   * @returns {Promise<boolean>} - 文件是否存在
   */
  static async exists(filePath) {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 检查文件是否存在（同步）
   * @param {string} filePath - 文件路径
   * @returns {boolean} - 文件是否存在
   */
  static existsSync(filePath) {
    try {
      fs.accessSync(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 复制文件
   * @param {string} srcPath - 源文件路径
   * @param {string} destPath - 目标文件路径
   * @returns {Promise<void>}
   */
  static async copyFile(srcPath, destPath) {
    try {
      await this.ensureDir(path.dirname(destPath));
      await fs.promises.copyFile(srcPath, destPath);
    } catch (error) {
      throw new Error(`复制文件失败: ${srcPath} -> ${destPath} - ${error.message}`);
    }
  }

  /**
   * 删除文件
   * @param {string} filePath - 文件路径
   * @returns {Promise<void>}
   */
  static async deleteFile(filePath) {
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw new Error(`删除文件失败: ${filePath} - ${error.message}`);
      }
    }
  }

  /**
   * 获取目录中的所有文件
   * @param {string} dirPath - 目录路径
   * @param {Object} options - 选项
   * @param {boolean} options.recursive - 是否递归
   * @param {Array} options.extensions - 文件扩展名过滤
   * @returns {Promise<Array>} - 文件列表
   */
  static async getFiles(dirPath, options = {}) {
    const { recursive = false, extensions = [] } = options;
    const files = [];

    try {
      const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory() && recursive) {
          const subFiles = await this.getFiles(fullPath, options);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          if (extensions.length === 0 || extensions.includes(path.extname(entry.name))) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      throw new Error(`读取目录失败: ${dirPath} - ${error.message}`);
    }

    return files;
  }

  /**
   * 获取文件信息
   * @param {string} filePath - 文件路径
   * @returns {Promise<Object>} - 文件信息
   */
  static async getFileInfo(filePath) {
    try {
      const stats = await fs.promises.stat(filePath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory()
      };
    } catch (error) {
      throw new Error(`获取文件信息失败: ${filePath} - ${error.message}`);
    }
  }

  /**
   * 格式化文件大小
   * @param {number} bytes - 字节数
   * @returns {string} - 格式化后的大小
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 获取文件扩展名
   * @param {string} filePath - 文件路径
   * @returns {string} - 文件扩展名
   */
  static getFileExtension(filePath) {
    return path.extname(filePath).toLowerCase();
  }

  /**
   * 获取文件名（不包含扩展名）
   * @param {string} filePath - 文件路径
   * @returns {string} - 文件名
   */
  static getFileName(filePath) {
    return path.basename(filePath, path.extname(filePath));
  }

  /**
   * 解析路径
   * @param {string} filePath - 文件路径
   * @returns {Object} - 解析结果
   */
  static parsePath(filePath) {
    const parsed = path.parse(filePath);
    return {
      dir: parsed.dir,
      name: parsed.name,
      ext: parsed.ext,
      base: parsed.base,
      root: parsed.root
    };
  }
} 