import Logger from './logging';
import { ConfigManager } from './config/index.js';
import { TemplateEngine } from './template/engine.js';
import { OUTPUT_DIR } from './constants/index.js';
import { writeFile } from './common/index.js';
import { replaceVariables } from './utils/index.js';
/**
 * 主要的代码生成器类
 */
export class Generator {
  constructor() {
    this.configManager = new ConfigManager(process.cwd());
    this.templateEngine = new TemplateEngine(process.cwd());
  }
  /**
   * 生成代码
   * @param {Object} options - 生成选项
   * @param {Array} options.modules - 要生成的模块列表
   * @param {Object} options.config - 额外的配置
   * @returns {Promise<void>}
   */
  async generate(modules) {
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
   * @param {Object} module - 模块配置
   * @param {Object} config - 全局配置
   * @returns {Promise<void>}
   */
  async generateModule(module) {
    const moduleConfig = await this.configManager.loadModuleConfig(module.configList);
    // 生成模块的每个模版
    for (const template of module.templates) {
      await this.generateTemplate(template, moduleConfig);
    }
  }

  /**
   * 生成单个模版
   * @param {Object} template - 模版配置
   * @param {Object} config - 配置数据
   * @returns {Promise<void>}
   */
  async generateTemplate(template, config) {
    // 替换模版配置中的变量
    const processedTemplate = replaceVariables(template, config);
    // 渲染模版
    const content = await this.templateEngine.render(processedTemplate.name, config);
    // 写入文件
    await writeFile(processedTemplate.outputName, content);
  }
} 