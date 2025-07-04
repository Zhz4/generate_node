import OAGenerator from '../lib/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 基础使用示例
 */
async function basicExample() {
  console.log('=== 基础使用示例 ===');
  
  // 创建生成器实例
  const generator = new OAGenerator({
    configPath: path.join(__dirname, 'config'),
    templatePath: path.join(__dirname, 'templates'),
    outputPath: path.join(__dirname, 'output')
  });

  // 生成代码
  try {
    await generator.generate({
      modules: [
        {
          name: 'contract',
          configList: ['main_config.json'],
          templates: [
            {
              name: 'template_api',
              outputName: 'contract-api.js'
            },
            {
              name: 'template_vue',
              outputName: 'contract-page.vue'
            }
          ]
        }
      ]
    });
    
    console.log('代码生成成功！');
  } catch (error) {
    console.error('生成失败:', error);
  }
}

/**
 * 高级使用示例
 */
async function advancedExample() {
  console.log('=== 高级使用示例 ===');
  
  const generator = new OAGenerator();

  // 动态设置路径
  generator.setConfigPath(path.join(__dirname, 'config'));
  generator.setTemplatePath(path.join(__dirname, 'templates'));
  generator.setOutputPath(path.join(__dirname, 'output'));

  // 使用自定义配置
  const customConfig = {
    apiFileName: 'customAPI',
    customField: 'customValue'
  };

  try {
    await generator.generate({
      config: customConfig,
      modules: [
        {
          name: 'custom-module',
          configList: ['edit_config.json'],
          templates: [
            {
              name: 'template_edit',
              outputName: '${apiFileName}-edit.vue'
            }
          ]
        }
      ]
    });
    
    console.log('自定义配置生成成功！');
  } catch (error) {
    console.error('生成失败:', error);
  }
}

/**
 * 运行示例
 */
async function runExamples() {
  try {
    await basicExample();
    console.log('\n');
    await advancedExample();
  } catch (error) {
    console.error('运行示例时出错:', error);
  }
}

// 如果直接运行此文件，则执行示例
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples();
}

export { basicExample, advancedExample, runExamples }; 