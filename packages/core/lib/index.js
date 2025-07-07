import { Generator } from "./generator.js";
import { TemplateEngine } from "./template/engine.js";
import { ConfigManager } from "./config/index.js";
import path from "path";
import { fileURLToPath } from "url";
import Logger from "./logging/index.js";
import { copyDirectory } from "./utils/index.js";
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
    // 确保config是一个数组
    const modules = Array.isArray(config) ? config : [];
    return await this.generator.generate(modules);
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
      await copyDirectory(initTemplatePath, targetPath);
      Logger.info("项目初始化完成！");
    } catch (error) {
      Logger.error("初始化失败:", error.message);
      throw error;
    }
  }
}

// 导出工具类
export { ConfigManager, TemplateEngine };

// 默认导出
export default Generate;
