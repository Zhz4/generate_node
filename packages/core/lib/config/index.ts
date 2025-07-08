import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { CONFIG_FILE } from "../constants/index.js";
import { fileExists } from "../utils/index.js";
/**
 * 配置管理器类
 */
export class ConfigManager {
  // 配置文件路径
  private configPath: string;
  constructor() {
    this.configPath = process.cwd();
  }
  /**
   * 加载配置
   * @returns {Promise<Object>} - 配置对象
   */
  async loadConfig(): Promise<Record<string, unknown>> {
    try {
      const configFile = path.join(this.configPath, CONFIG_FILE);
      if (await fileExists(configFile)) {
        const content = await fs.promises.readFile(configFile, "utf8");
        return JSON.parse(content);
      }
      return {};
    } catch (error) {
      console.warn(
        "加载配置失败:",
        error instanceof Error ? error.message : error
      );
      return {};
    }
  }

  /**
   * 根据configList映射的路径加载变量配置
   * @param configList - 配置文件列表
   * @returns 合并后的配置对象
   */
  async loadModuleConfig(
    configList: string[] = []
  ): Promise<Record<string, unknown>> {
    const configs: Record<string, unknown>[] = [];

    for (const configFile of configList) {
      try {
        const filePath = path.isAbsolute(configFile)
          ? configFile
          : path.join(this.configPath, configFile);
        if (await fileExists(filePath)) {
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
        console.warn(
          `加载配置文件 ${configFile} 失败:`,
          error instanceof Error ? error.message : error
        );
      }
    }

    return this.mergeConfigs(configs);
  }

  /**
   * 合并配置对象
   * @param {Array} configs - 配置对象数组
   * @returns {Object} - 合并后的配置对象
   */
  mergeConfigs(configs: Record<string, unknown>[]): Record<string, unknown> {
    return configs.reduce((merged, config) => {
      return this.deepMerge(merged, config);
    }, {});
  }

  /**
   * 深度合并对象
   * @param target - 目标对象
   * @param source - 源对象
   * @returns 合并后的对象
   */
  deepMerge(
    target: Record<string, unknown>,
    source: Record<string, unknown>
  ): Record<string, unknown> {
    if (typeof target !== "object" || typeof source !== "object") return source;
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const sourceVal = source[key];
        const targetVal = target[key];
        if (
          typeof sourceVal === "object" &&
          sourceVal !== null &&
          !Array.isArray(sourceVal)
        ) {
          target[key] = this.deepMerge(
            (targetVal as Record<string, unknown>) ||
              ({} as Record<string, unknown>),
            sourceVal as Record<string, unknown>
          );
        } else {
          target[key] = sourceVal;
        }
      }
    }
    return target;
  }
}
