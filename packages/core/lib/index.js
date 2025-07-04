import { Generator } from './generator.js';
import { TemplateEngine } from './template/engine.js';
import { ConfigManager } from './config/manager.js';
import { FileUtils } from './utils/fileUtils.js';

/**
 * 代码生成器主类
 */
export class OAGenerator {
  constructor(options = {}) {
    this.configPath = options.configPath || process.cwd();
    this.templatePath = options.templatePath || process.cwd();
    this.outputPath = options.outputPath || './output';
    
    this.configManager = new ConfigManager(this.configPath);
    this.templateEngine = new TemplateEngine(this.templatePath);
    this.generator = new Generator({
      configManager: this.configManager,
      templateEngine: this.templateEngine,
      outputPath: this.outputPath
    });
  }

  /**
   * 生成代码
   * @param {Object} options - 生成选项
   * @returns {Promise<void>}
   */
  async generate(options = {}) {
    return await this.generator.generate(options);
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
export default OAGenerator; 