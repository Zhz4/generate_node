import { fileExistsSync } from "@core/utils";
import ejs from "ejs";
import fs from "fs";
import path from "path";

/**
 * 模版引擎类
 */
export class TemplateEngine {
  private templatePath: string;
  private templateCache: Map<string, string>;
  constructor() {
    this.templatePath = process.cwd();
    this.templateCache = new Map();
  }

  /**
   * 渲染模版
   * @param {string} templateName - 模版名称
   * @param {Object} data - 模版数据
   * @param {Object} options - 渲染选项
   * @returns {Promise<string>} - 渲染后的内容
   */
  async render(
    templateName: string,
    data: Record<string, unknown>,
    options: Record<string, unknown> = {}
  ): Promise<string> {
    try {
      const template = await this.loadTemplate(templateName);
      // 添加工具函数到模版数据
      const templateData = {
        ...data,
        ...this.getUtilityFunctions(),
      };

      // 渲染模版
      const renderedContent = ejs.render(template, templateData, {
        filename: this.getTemplatePath(templateName),
        ...options,
      });
      return renderedContent;
    } catch (error) {
      console.error(`渲染模版 ${templateName} 时出错:`, error);
      throw error;
    }
  }

  /**
   * 加载模版文件
   * @param {string} templateName - 模版名称
   * @returns {Promise<string>} - 模版内容
   */
  async loadTemplate(templateName: string): Promise<string> {
    // 检查缓存
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }
    const templatePath = this.getTemplatePath(templateName);
    try {
      const content = await fs.promises.readFile(templatePath, "utf8");
      // 缓存模版内容
      this.templateCache.set(templateName, content);
      return content;
    } catch (error) {
      throw new Error(`无法加载模版文件: ${templatePath}`);
    }
  }

  /**
   * 获取模版文件路径
   * @param templateName - 模版名称
   * @returns 模版文件路径
   */
  getTemplatePath(templateName: string): string {
    // 支持多种模版文件扩展名
    const extensions = [".ejs"];

    for (const ext of extensions) {
      const fileName = templateName.endsWith(ext)
        ? templateName
        : `${templateName}${ext}`;
      const fullPath = path.join(this.templatePath, fileName);

      if (fileExistsSync(fullPath)) {
        return fullPath;
      }
    }
    // 默认返回 .ejs 扩展名的路径
    return path.join(this.templatePath, `${templateName}.ejs`);
  }

  /**
   * 获取工具函数
   * @returns 工具函数对象
   */
  getUtilityFunctions(): Record<string, (...args: any[]) => any> {
    return {
      // JSON 转 JS 格式化函数
      jsonToJsFormat: (json: any) => {
        if (typeof json === "string") {
          try {
            json = JSON.parse(json);
          } catch {
            return json;
          }
        }
        // 转换为JavaScript对象字面量格式，避免Vue模板中的引号冲突
        return JSON.stringify(json, null, 2)
          .replace(/"/g, "'") // 将双引号替换为单引号
          .replace(/\n\s*/g, " "); // 压缩为单行，避免模板换行问题
      },

      // 首字母大写
      capitalize: (str: string) => {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
      },

      // 驼峰命名转换
      camelCase: (str: string) => {
        if (!str) return str;
        return str.replace(/[-_\s]+(.)?/g, (_: string, c: string) =>
          c ? c.toUpperCase() : ""
        );
      },

      // 下划线命名转换
      snakeCase: (str: string) => {
        if (!str) return str;
        return str
          .replace(/([A-Z])/g, "_$1")
          .toLowerCase()
          .replace(/^_/, "");
      },

      // 短横线命名转换
      kebabCase: (str: string) => {
        if (!str) return str;
        return str
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase()
          .replace(/^-/, "");
      },
    };
  }
}
