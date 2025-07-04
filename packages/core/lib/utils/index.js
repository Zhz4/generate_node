/**
 * 替换变量
 * @param {Object} template - 模版配置
 * @param {Object} config - 配置数据
 * @returns {Object} - 处理后的模版配置
 */
export function replaceVariables(template, config) {
  const result = { ...template };
  // 替换输出文件名中的变量
  if (result.outputName) {
    result.outputName = interpolateString(result.outputName, config);
  }
  return result;
}

/**
 * 字符串插值
 * @param {string} str - 原始字符串
 * @param {Object} data - 数据对象
 * @returns {string} - 插值后的字符串
 */
export function interpolateString(str, data) {
  return str.replace(/\$\{([^}]+)\}/g, (match, key) => {
    return data[key] || match;
  });
}
