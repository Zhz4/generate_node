import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Logger from '../logging/index.js';

/**
 * 配置管理器类
 */
export class ConfigManager {
  constructor(configPath) {
    this.configPath = configPath;
  }

    /**
   * 自动读取 generate.yml 配置文件
   * @returns {Object} 配置对象
   */
    loadYamlConfig() {
      try {
        // 寻找 generate.yml 文件，优先级：当前目录 > 父级目录
        const possiblePaths = [
          path.join(process.cwd(), 'generate.yml'),
        ];
  
        for (const configPath of possiblePaths) {
          if (fs.existsSync(configPath)) {
            console.log(`📄 找到配置文件: ${configPath}`);
            const fileContents = fs.readFileSync(configPath, 'utf8');
            const config = yaml.load(fileContents);
            
            // 转换相对路径为绝对路径
            if (config.configPath && !path.isAbsolute(config.configPath)) {
              config.configPath = path.resolve(path.dirname(configPath), config.configPath);
            }
            if (config.templatePath && !path.isAbsolute(config.templatePath)) {
              config.templatePath = path.resolve(path.dirname(configPath), config.templatePath);
            }
            if (config.outputPath && !path.isAbsolute(config.outputPath)) {
              config.outputPath = path.resolve(path.dirname(configPath), config.outputPath);
            }
            Logger.info(`✅ 成功加载配置文件`);
            return config;
          }
        }
        Logger.error(`⚠️  未找到 generate.yml 配置文件`);
        return {};
      } catch (error) {
        Logger.error(`⚠️  读取配置文件失败: ${error.message}`);
        return {};
      }
    }

  /**
   * 加载配置
   * @param {Object} additionalConfig - 额外的配置
   * @returns {Promise<Object>} - 配置对象
   */
  async loadConfig(additionalConfig = {}) {
    const defaultConfig = await this.loadDefaultConfig();
    return { ...defaultConfig, ...additionalConfig };
  }

  /**
   * 加载默认配置
   * @returns {Promise<Object>} - 默认配置对象
   */
  async loadDefaultConfig() {
    try {
      const configFile = path.join(this.configPath, 'main_config.json');
      if (await this.fileExists(configFile)) {
        const content = await fs.promises.readFile(configFile, 'utf8');
        return JSON.parse(content);
      }
      return {};
    } catch (error) {
      console.warn('加载默认配置失败:', error.message);
      return {};
    }
  }

  /**
   * 加载模块配置
   * @param {Array} configList - 配置文件列表
   * @returns {Promise<Object>} - 合并后的配置对象
   */
  async loadModuleConfig(configList = []) {
    const configs = [];
    
    for (const configFile of configList) {
      try {
        const filePath = path.isAbsolute(configFile) 
          ? configFile 
          : path.join(this.configPath, configFile);
        
        if (await this.fileExists(filePath)) {
          const content = await fs.promises.readFile(filePath, 'utf8');
          configs.push(JSON.parse(content));
        }
      } catch (error) {
        console.warn(`加载配置文件 ${configFile} 失败:`, error.message);
      }
    }
    
    return this.mergeConfigs(configs);
  }

  /**
   * 加载任务配置
   * @returns {Promise<Object>} - 任务配置对象
   */
  async loadTask() {
    try {
      const taskFile = path.join(this.configPath, 'task.yml');
      if (await this.fileExists(taskFile)) {
        const content = await fs.promises.readFile(taskFile, 'utf8');
        return yaml.load(content);
      }
      return { writeCoreModules: [] };
    } catch (error) {
      console.warn('加载任务配置失败:', error.message);
      return { writeCoreModules: [] };
    }
  }

  /**
   * 获取模块列表
   * @returns {Promise<Array>} - 模块列表
   */
  async getModules() {
    try {
      const modulesFile = path.join(this.configPath, 'modules.json');
      if (await this.fileExists(modulesFile)) {
        const content = await fs.promises.readFile(modulesFile, 'utf8');
        return JSON.parse(content);
      }
      return [];
    } catch (error) {
      console.warn('加载模块列表失败:', error.message);
      return [];
    }
  }

  /**
   * 合并配置对象
   * @param {Array} configs - 配置对象数组
   * @returns {Object} - 合并后的配置对象
   */
  mergeConfigs(configs) {
    return configs.reduce((merged, config) => {
      return this.deepMerge(merged, config);
    }, {});
  }

  /**
   * 深度合并对象
   * @param {Object} target - 目标对象
   * @param {Object} source - 源对象
   * @returns {Object} - 合并后的对象
   */
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (Array.isArray(source[key])) {
          result[key] = [...(result[key] || []), ...source[key]];
        } else if (typeof source[key] === 'object' && source[key] !== null) {
          result[key] = this.deepMerge(result[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }

  /**
   * 检查文件是否存在
   * @param {string} filePath - 文件路径
   * @returns {Promise<boolean>} - 文件是否存在
   */
  async fileExists(filePath) {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 设置配置路径
   * @param {string} configPath - 新的配置路径
   */
  setConfigPath(configPath) {
    this.configPath = configPath;
  }
} 