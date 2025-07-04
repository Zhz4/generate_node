#!/usr/bin/env node
import { Generate } from "./index.js";
import { program } from "commander";

program.name("generate").description("代码生成工具").version("1.0.0");

program
  .command("generate")
  .alias("g")
  .description("生成代码")
  .action(async (options) => {
    try {
      console.log("🚀 开始生成代码...");
      const generator = new Generate();
      await generator.generate();
    } catch (error) {
      process.exit(1);
    }
  });

program
  .command("generate:init")
  .description("初始化项目配置")
  .action(async (options) => {
    try {
      console.log("🚀 初始化项目配置...");
      const generator = new Generate();
      await generator.init();
    } catch (error) {
      console.error("❌ 初始化失败:", error.message);
      process.exit(1);
    }
  });

program.parse();
