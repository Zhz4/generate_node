import { OAGenerator } from '@generate_node/core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🚀 OA Generator 代码生成示例');
  console.log('================================');

  try {
    // 创建生成器实例
    const generator = new OAGenerator({
      configPath: path.join(__dirname, './'),      // 配置文件路径
      templatePath: path.join(__dirname, './template'),  // 模版文件路径
      outputPath: path.join(__dirname, './output')       // 输出路径
    });

    // 设置自定义配置
    const customConfig = {
      projectName: 'OA管理系统',
      author: '开发团队',
      version: '1.0.0',
      description: '这是一个自动生成的OA管理系统'
    };

    // 生成代码
    await generator.generate({
      config: customConfig
    });

    console.log('✅ 代码生成完成！');
    console.log('📁 生成的文件位于:', path.join(__dirname, './output'));
    
  } catch (error) {
    console.error('❌ 代码生成失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main().catch(console.error);
