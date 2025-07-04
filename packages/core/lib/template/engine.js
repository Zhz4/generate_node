import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

/**
 * 模版引擎类
 */
export class TemplateEngine {
  constructor(templatePath) {
    this.templatePath = templatePath;
    this.templateCache = new Map();
  }

  /**
   * 渲染模版
   * @param {string} templateName - 模版名称
   * @param {Object} data - 模版数据
   * @param {Object} options - 渲染选项
   * @returns {Promise<string>} - 渲染后的内容
   */
  async render(templateName, data, options = {}) {
    try {
      const template = await this.loadTemplate(templateName);
      
      // 添加工具函数到模版数据
      const templateData = {
        ...data,
        ...this.getUtilityFunctions()
      };

      // 渲染模版
      const renderedContent = ejs.render(template, templateData, {
        filename: this.getTemplatePath(templateName),
        ...options
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
  async loadTemplate(templateName) {
    // 检查缓存
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName);
    }

    const templatePath = this.getTemplatePath(templateName);
    
    try {
      const content = await fs.promises.readFile(templatePath, 'utf8');
      
      // 缓存模版内容
      this.templateCache.set(templateName, content);
      
      return content;
    } catch (error) {
      throw new Error(`无法加载模版文件: ${templatePath}`);
    }
  }

  /**
   * 获取模版文件路径
   * @param {string} templateName - 模版名称
   * @returns {string} - 模版文件路径
   */
  getTemplatePath(templateName) {
    // 支持多种模版文件扩展名
    const extensions = ['.ejs', '.html', '.htm'];
    
    for (const ext of extensions) {
      const fileName = templateName.endsWith(ext) ? templateName : `${templateName}${ext}`;
      const fullPath = path.join(this.templatePath, fileName);
      
      if (this.fileExistsSync(fullPath)) {
        return fullPath;
      }
    }
    
    // 默认返回 .ejs 扩展名的路径
    return path.join(this.templatePath, `${templateName}.ejs`);
  }

  /**
   * 检查文件是否存在（同步）
   * @param {string} filePath - 文件路径
   * @returns {boolean} - 文件是否存在
   */
  fileExistsSync(filePath) {
    try {
      fs.accessSync(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 获取工具函数
   * @returns {Object} - 工具函数对象
   */
  getUtilityFunctions() {
    return {
      // JSON 转 JS 格式化函数
      jsonToJsFormat: (json) => {
        if (typeof json === 'string') {
          try {
            json = JSON.parse(json);
          } catch {
            return json;
          }
        }
        // 转换为JavaScript对象字面量格式，避免Vue模板中的引号冲突
        return JSON.stringify(json, null, 2)
          .replace(/"/g, "'")  // 将双引号替换为单引号
          .replace(/\n\s*/g, ' '); // 压缩为单行，避免模板换行问题
      },
      
      // 首字母大写
      capitalize: (str) => {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
      
      // 驼峰命名转换
      camelCase: (str) => {
        if (!str) return str;
        return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
      },
      
      // 下划线命名转换
      snakeCase: (str) => {
        if (!str) return str;
        return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
      },
      
      // 短横线命名转换
      kebabCase: (str) => {
        if (!str) return str;
        return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
      }
    };
  }

  /**
   * 清除模版缓存
   * @param {string} templateName - 模版名称（可选）
   */
  clearCache(templateName = null) {
    if (templateName) {
      this.templateCache.delete(templateName);
    } else {
      this.templateCache.clear();
    }
  }

  /**
   * 设置模版路径
   * @param {string} templatePath - 新的模版路径
   */
  setTemplatePath(templatePath) {
    this.templatePath = templatePath;
    this.clearCache(); // 清除缓存
  }

  /**
   * 获取可用的模版列表
   * @returns {Promise<Array>} - 模版名称列表
   */
  async getAvailableTemplates() {
    try {
      const files = await fs.promises.readdir(this.templatePath);
      return files
        .filter(file => file.endsWith('.ejs') || file.endsWith('.html') || file.endsWith('.htm'))
        .map(file => path.basename(file, path.extname(file)));
    } catch (error) {
      console.warn('获取模版列表失败:', error.message);
      return [];
    }
  }
} 