import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 主要的代码生成器类
 */
export class Generator {
  constructor(options = {}) {
    this.configManager = options.configManager;
    this.templateEngine = options.templateEngine;
    this.outputPath = options.outputPath || './output';
  }

  /**
   * 生成代码
   * @param {Object} options - 生成选项
   * @param {Array} options.modules - 要生成的模块列表
   * @param {Object} options.config - 额外的配置
   * @returns {Promise<void>}
   */
  async generate(options = {}) {
    try {
      // 加载配置
      const config = await this.configManager.loadConfig(options.config);
      
      // 获取模块列表
      const modules = options.modules || await this.configManager.getModules();
      
      // 生成每个模块
      for (const module of modules) {
        await this.generateModule(module, config);
      }
      console.log('📁 生成的文件位于:', this.outputPath);
    } catch (error) {
      console.error('生成代码时出错:', error);
      throw error;
    }
  }

  /**
   * 生成单个模块
   * @param {Object} module - 模块配置
   * @param {Object} config - 全局配置
   * @returns {Promise<void>}
   */
  async generateModule(module, config) {
    // 检查任务配置
    const task = await this.configManager.loadTask();
    if (task.writeCoreModules && !task.writeCoreModules.includes(module.name)) {
      return;
    }

    // 合并模块配置
    const moduleConfig = await this.configManager.loadModuleConfig(module.configList);
    const mergedConfig = { ...config, ...moduleConfig };

    // 生成模块的每个模版
    for (const template of module.templates) {
      await this.generateTemplate(template, mergedConfig);
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
    const processedTemplate = this.replaceVariables(template, config);
    
    // 渲染模版
    const content = await this.templateEngine.render(processedTemplate.name, config);
    
    // 写入文件
    await this.writeFile(processedTemplate.outputName, content);
  }

  /**
   * 替换变量
   * @param {Object} template - 模版配置
   * @param {Object} config - 配置数据
   * @returns {Object} - 处理后的模版配置
   */
  replaceVariables(template, config) {
    const result = { ...template };
    
    // 替换输出文件名中的变量
    if (result.outputName) {
      result.outputName = this.interpolateString(result.outputName, config);
    }
    
    return result;
  }

  /**
   * 字符串插值
   * @param {string} str - 原始字符串
   * @param {Object} data - 数据对象
   * @returns {string} - 插值后的字符串
   */
  interpolateString(str, data) {
    return str.replace(/\$\{([^}]+)\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  /**
   * 写入文件
   * @param {string} fileName - 文件名
   * @param {string} content - 文件内容
   * @returns {Promise<void>}
   */
  async writeFile(fileName, content) {
    const fs = await import('fs');
    const outputDir = path.resolve(this.outputPath);
    const filePath = path.join(outputDir, fileName);
    
    // 确保目录存在
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    
    // 写入文件
    await fs.promises.writeFile(filePath, content, 'utf8');
    console.log(`生成文件: ${filePath}`);
  }

  /**
   * 更新配置管理器
   * @param {ConfigManager} configManager - 新的配置管理器
   */
  updateConfigManager(configManager) {
    this.configManager = configManager;
  }

  /**
   * 更新模版引擎
   * @param {TemplateEngine} templateEngine - 新的模版引擎
   */
  updateTemplateEngine(templateEngine) {
    this.templateEngine = templateEngine;
  }

  /**
   * 更新输出路径
   * @param {string} outputPath - 新的输出路径
   */
  updateOutputPath(outputPath) {
    this.outputPath = outputPath;
  }
} 