import {
  promises as fs
} from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export async function readConfigFile(configFileName) {
  // 配置文件所在的目录
  const configDir = './config';

  try {
    // 构建配置文件的完整路径
    const configFilePath = path.join(configDir, configFileName);

    // 读取文件内容
    const fileContent = await fs.readFile(configFilePath, 'utf8');

    // 将文件内容解析为 JavaScript 对象
    const config = JSON.parse(fileContent);

    console.log('Config loaded successfully:', config);
    return config;
  } catch (error) {
    console.error('Error reading config file:', error);
    throw error;
  }
}

export async function loadYamlConfig(fileName) {
  // 配置文件所在的目录
  const configDir = './config';
  const filePath = path.join(configDir, fileName); // 设置文件路径，使用 process.cwd() 以获取当前工作目录

  try {
    // 读取 YAML 文件
    const fileContent = await fs.readFile(filePath, 'utf8'); // 使用异步读取文件
    // 解析 YAML 文件为 JavaScript 对象
    const config = yaml.load(fileContent);
    return config;
  } catch (error) {
    console.error('加载 YAML 配置文件时出错:', error);
    throw error;
  }
}