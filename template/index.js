import ejs from "ejs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 读取模板文件入口
 * @param {*} templateName 模板名称
 * @param {*} data 模板参数
 * @returns 渲染后的 HTML
 */
export default function renderTemplate(templateName, data) {
  if (templateName === undefined) {
    console.error("请输入模板名称");
    return;
  }

  // 定义模板路径
  const templatePath = path.join(__dirname, "ejs", `${templateName}.ejs`);

  try {
    // 读取模板文件（同步）
    const template = fs.readFileSync(templatePath, "utf8");

    // 渲染模板
    const renderedHtml = ejs.render(template, data);

    return renderedHtml;
  } catch (err) {
    console.error("读取模板文件时出错:", err);
    return null; // 或者处理错误的其他方式
  }
}
