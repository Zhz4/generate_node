import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { pathToFileURL } from "url";
import { CONFIG_FILE } from "../constants/index.js";
/**
 * 配置管理器类
 */
export class ConfigManager {
  constructor(configPath) {
    this.configPath = configPath;
  }
  /**
   * 加载配置
   * @returns {Promise<Object>} - 配置对象
   */
  async loadConfig() {
    try {
      const configFile = path.join(this.configPath, CONFIG_FILE);
      if (await this.fileExists(configFile)) {
        const content = await fs.promises.readFile(configFile, "utf8");
        return JSON.parse(content);
      }
      return {};
    } catch (error) {
      console.warn("加载配置失败:", error.message);
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
          const fileExt = path.extname(filePath).toLowerCase();
          let configData;

          if (fileExt === ".js") {
            // 处理JS格式的配置文件
            const fileUrl = pathToFileURL(path.resolve(filePath)).href;
            const configModule = await import(fileUrl);
            configData = configModule.default || configModule;
          } else {
            // 处理JSON格式的配置文件
            const content = await fs.promises.readFile(filePath, "utf8");
            configData = JSON.parse(content);
          }

          configs.push(configData);
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
      const taskFile = path.join(this.configPath, "task.yml");
      if (await this.fileExists(taskFile)) {
        const content = await fs.promises.readFile(taskFile, "utf8");
        return yaml.load(content);
      }
      return { writeCoreModules: [] };
    } catch (error) {
      console.warn("加载任务配置失败:", error.message);
      return { writeCoreModules: [] };
    }
  }

  /**
   * 获取模块列表
   * @returns {Promise<Array>} - 模块列表
   */
  async getModules() {
    try {
      const modulesFile = path.join(this.configPath, "modules.json");
      if (await this.fileExists(modulesFile)) {
        const content = await fs.promises.readFile(modulesFile, "utf8");
        return JSON.parse(content);
      }
      return [];
    } catch (error) {
      console.warn("加载模块列表失败:", error.message);
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
        } else if (typeof source[key] === "object" && source[key] !== null) {
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
