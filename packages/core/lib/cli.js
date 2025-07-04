#!/usr/bin/env node
import { OAGenerator } from './index.js';
import { program } from 'commander';
import path from 'path';

program
  .name('oa-generate')
  .description('OA代码生成工具')
  .version('1.0.0');

program
  .command('generate')
  .alias('g')
  .description('生成代码')
  .option('-c, --config <path>', '配置文件路径', process.cwd())
  .option('-t, --template <path>', '模版文件路径', process.cwd())
  .option('-o, --output <path>', '输出路径', './output')
  .option('-m, --modules <modules>', '指定要生成的模块，用逗号分隔')
  .action(async (options) => {
    try {
      console.log('🚀 开始生成代码...');
      
      const generator = new OAGenerator({
        configPath: path.resolve(options.config),
        templatePath: path.resolve(options.template),
        outputPath: path.resolve(options.output)
      });

      const generateOptions = {};
      
      if (options.modules) {
        generateOptions.modules = options.modules.split(',').map(m => m.trim());
      }

      await generator.generate(generateOptions);
      
      console.log('✅ 代码生成完成！');
    } catch (error) {
      console.error('❌ 生成失败:', error.message);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('初始化项目配置')
  .option('-d, --dir <directory>', '目标目录', process.cwd())
  .action(async (options) => {
    try {
      console.log('🚀 初始化项目配置...');
      
      const targetDir = path.resolve(options.dir);
      
      // 这里可以添加初始化逻辑，比如复制模版文件等
      console.log(`📁 目标目录: ${targetDir}`);
      console.log('✅ 初始化完成！');
      console.log('💡 请参考文档配置您的模版和配置文件。');
    } catch (error) {
      console.error('❌ 初始化失败:', error.message);
      process.exit(1);
    }
  });

program.parse(); 