import Logger from "./logging/index.js";
import { ConfigManager } from "./config/index.js";
import { TemplateEngine } from "./template/engine.js";
import { OUTPUT_DIR } from "./constants/index.js";
import { writeFile } from "./common/index.js";
import { replaceVariables } from "./utils/index.js";
import { Module, Template } from "@core/types";
/**
 * 主要的代码生成器类
 */
export class Generator {
  private configManager: ConfigManager;
  private templateEngine: TemplateEngine;
  constructor() {
    this.configManager = new ConfigManager();
    this.templateEngine = new TemplateEngine();
  }
  /**
   * 生成代码
   * @param modules - 要生成的模块列表
   */
  async generate(modules: Module[]) {
    try {
      for (const module of modules) {
        await this.generateModule(module);
      }
      Logger.info(`📁 生成的文件位于: ${process.cwd()}/${OUTPUT_DIR}`);
    } catch (error) {
      Logger.error(`生成代码时出错: ${error}`);
      throw error;
    }
  }

  /**
   * 生成单个模块
   * @param module - 模块配置
   */
  async generateModule(module: Module) {
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
  async generateTemplate(template: Template, config: Record<string, unknown>) {
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
