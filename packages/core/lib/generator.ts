import Logger from "./logging/index.js";
import { ConfigManager } from "./config/index.js";
import { TemplateEngine } from "./template/engine.js";
import { OUTPUT_DIR } from "./constants/index.js";
import { writeFile } from "./common/index.js";
import { replaceVariables } from "./utils/index.js";
import { Module, Template } from "./types";
import { fileURLToPath } from "url";
import { copyDirectory } from "./utils/index.js";
import path from "path";

/**
 * 主要的代码生成器类
 */
class Generator {
  private configManager: ConfigManager;
  private templateEngine: TemplateEngine;
  private path: string;
  constructor() {
    this.configManager = new ConfigManager();
    this.templateEngine = new TemplateEngine();
    this.path = process.cwd();
  }

  /**
   * 获取所有可用的模块
   */
  async getAvailableModules() {
    const config = await this.configManager.loadConfig();
    const modules = Array.isArray(config) ? config : [];
    return modules;
  }

  /**
   * 生成代码
   * @param selectedModuleNames - 要生成的模块列表
   */
  async generate(selectedModuleNames: string[] = []) {
    try {
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

      for (const module of modulesToGenerate) {
        await this.generateModule(module);
      }
      Logger.info(`📁 生成的文件位于: ${process.cwd()}/${OUTPUT_DIR}`);
    } catch (error) {
      Logger.error(`生成代码时出错: ${error}`);
      throw error;
    }
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

  /**
   * 生成单个模块
   * @param module - 模块配置
   */
  private async generateModule(module: Module) {
    const moduleConfig = await this.configManager.loadModuleConfig(
      module.configList
    );
    // 生成模块的每个模版
    for (const template of module.templates) {
      await this.generateTemplate(template, moduleConfig);
    }
  }

  /**
   * 生成单个模版
   * @param template - 模版配置
   * @param config - 配置数据的整合
   */
  private async generateTemplate(
    template: Template,
    config: Record<string, unknown>
  ) {
    // 替换模版配置中的变量
    const processedTemplate = replaceVariables(template, config);
    // 渲染模版
    const content = await this.templateEngine.render(
      processedTemplate.name,
      config
    );
    // 写入文件
    await writeFile(processedTemplate.outputName, content);
  }
}

export default new Generator();
