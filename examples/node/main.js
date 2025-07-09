import { generator } from "@smooth_zhz/generate_node-core";

async function main() {
  try {
    // 生成代码
    await generator.generate();
    // console.log('✅ 代码生成完成！');
    // console.log('📁 生成的文件位于:', path.join(__dirname, './output'));
    // 获取所有可用的模块
    // const modules = await generator.getAvailableModules();
    // console.log(modules);
  } catch (error) {
    console.error("❌ 代码生成失败:", error.message);
    process.exit(1);
  }
}

// 运行主函数
main().catch(console.error);
