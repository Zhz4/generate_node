import { Generator } from "./generator.js";
import { TemplateEngine } from "./template/engine.js";
import { ConfigManager } from "./config/index.js";
import path from "path";
import { fileURLToPath } from "url";
import Logger from "./logging/index.js";
import { copyDirectory } from "./utils/index.js";
import { Module } from "@core/types";
/**
 * 代码生成器主类
 */
export class Generate {
  private configManager: ConfigManager;
  private generator: Generator;
  private path: string;
  constructor() {
    this.configManager = new ConfigManager();
    this.generator = new Generator();
    this.path = process.cwd();
  }

  /**
   * 获取所有可用的模块
   * @returns {Promise<Array>} 模块列表
   */
  async getAvailableModules() {
    const config = await this.configManager.loadConfig();
    const modules = Array.isArray(config) ? config : [];
    return modules;
  }

  /**
   * 生成代码
   * @param {Array} selectedModuleNames - 选择的模块名称列表，如果为空则生成所有模块
   * @returns {Promise<void>}
   */
  async generate(selectedModuleNames: string[] = []) {
    const config = await this.configManager.loadConfig();
    const allModules = Array.isArray(config) ? config : [];
    // 如果没有选择模块，则生成所有模块
    let modulesToGenerate: Module[] = allModules;
    // 如果有选择的模块，则只生成选中的模块
    if (selectedModuleNames && selectedModuleNames.length > 0) {
      modulesToGenerate = allModules.filter((module: Module) =>
        selectedModuleNames.includes(module.name)
      );
    }
    if (modulesToGenerate.length === 0) {
      Logger.error("没有找到可用的模块");
      return;
    }
    return await this.generator.generate(modulesToGenerate);
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
      Logger.error(
        "初始化失败:",
        error instanceof Error ? error.message : (error as string)
      );
      throw error;
    }
  }
}

// 导出工具类
export { ConfigManager, TemplateEngine };

// 默认导出
export default Generate;
