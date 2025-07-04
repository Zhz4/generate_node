import { Generator } from './generator.js';
import { TemplateEngine } from './template/engine.js';
import { ConfigManager } from './config/index.js';
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
    const config = await this.configManager.loadConfig();
    return await this.generator.generate(config);
  }
}

// 导出工具类
export { ConfigManager, TemplateEngine };

// 默认导出
export default Generate; 