import { Generator } from "./generator.js";
import { TemplateEngine } from "./template/engine.js";
import { ConfigManager } from "./config/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Logger from "./logging/index.js";
/**
 * 代码生成器主类
 */
export class Generate {
  constructor() {
    this.configManager = new ConfigManager(process.cwd());
    this.generator = new Generator();
    this.path = process.cwd();
  }
  /**
   * 生成代码
   * @param {Object} options - 生成选项
   * @returns {Promise<void>}
   */
  async generate() {
    const config = await this.configManager.loadConfig();
    return await this.generator.generate(config);
  }

  /**
   * 初始化创建配置文件
   */
  async init() {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const initTemplatePath = path.join(__dirname, "initTemplate");
      const targetPath = this.path;
      Logger.info("开始初始化项目...");
      await this.copyDirectory(initTemplatePath, targetPath);
      Logger.info("项目初始化完成！");
    } catch (error) {
      Logger.error("初始化失败:", error.message);
      throw error;
    }
  }

  /**
   * 复制目录
   * @param {string} src - 源目录路径
   * @param {string} dest - 目标目录路径
   */
  async copyDirectory(src, dest) {
    await fs.promises.mkdir(dest, { recursive: true });
    const files = await fs.promises.readdir(src);

    for (const file of files) {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      const stat = await fs.promises.stat(srcPath);

      if (stat.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  }
}

// 导出工具类
export { ConfigManager, TemplateEngine };

// 默认导出
export default Generate;
