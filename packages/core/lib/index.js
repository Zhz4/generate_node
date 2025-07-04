import { Generator } from './generator.js';
import { TemplateEngine } from './template/engine.js';
import { ConfigManager } from './config/manager.js';
import { FileUtils } from './utils/fileUtils.js';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from './logging/index.js';

// 获取当前文件的目录路径（ES modules 兼容）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 代码生成器主类
 */
export class Generate {
  constructor() {
    this.configManager = new ConfigManager(process.cwd());
    this.generator = new Generator();
  }
  /**
   * 生成代码
   * @param {Object} options - 生成选项
   * @returns {Promise<void>}
   */
  async generate() {
    const config = await this.configManager.loadYamlConfig();
    return await this.generator.generate(config);
  }

  /**
   * 设置配置路径
   * @param {string} path - 配置文件路径
   */
  setConfigPath(path) {
    this.configPath = path;
    this.configManager = new ConfigManager(path);
    this.generator.updateConfigManager(this.configManager);
  }

  /**
   * 设置模版路径
   * @param {string} path - 模版文件路径
   */
  setTemplatePath(path) {
    this.templatePath = path;
    this.templateEngine = new TemplateEngine(path);
    this.generator.updateTemplateEngine(this.templateEngine);
  }

  /**
   * 设置输出路径
   * @param {string} path - 输出路径
   */
  setOutputPath(path) {
    this.outputPath = path;
    this.generator.updateOutputPath(path);
  }
}

// 导出工具类
export { ConfigManager, TemplateEngine, FileUtils };

// 默认导出
export default Generate; 