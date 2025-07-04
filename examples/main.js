import { Generate } from '@smooth_zhz/generate_node-core';
async function main() {
  console.log('🚀 OA Generator 代码生成示例');
  console.log('================================');

  try {
    // 创建生成器实例
    const generator = new Generate();
    // 生成代码
    await generator.generate();
    // console.log('✅ 代码生成完成！');
    // console.log('📁 生成的文件位于:', path.join(__dirname, './output'));
  } catch (error) {
    console.error('❌ 代码生成失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main().catch(console.error);
