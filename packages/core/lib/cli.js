#!/usr/bin/env node
import { Generate } from "./index.js";
import { program } from "commander";
import inquirer from "inquirer";

program.name("generate").description("代码生成工具").version("1.0.0");

program
  .command("code")
  .description("生成代码")
  .option("-a, --all", "生成所有模块（跳过交互式选择）")
  .action(async (options) => {
    try {
      console.log("🚀 开始生成代码...");
      const generator = new Generate();
      if (options.all) {
        await generator.generate();
        return;
      }
      const allModules = await generator.getAvailableModules();
      if (allModules.length === 0) {
        console.log("❌ 没有找到可用的模块配置");
        process.exit(1);
      }
      const { selectedModules } = await inquirer.prompt([
        {
          type: "checkbox",
          name: "selectedModules",
          message: "请选择需要生成的模块:",
          choices: allModules.map((module) => ({
            name: module.name,
            value: module.name,
          })),
          validate: (input) => {
            if (input.length === 0) {
              return "请至少选择一个模块";
            }
            return true;
          },
        },
      ]);
      console.log(`✅ 已选择模块: ${selectedModules.join(", ")}`);
      await generator.generate(selectedModules);
    } catch (error) {
      console.error("❌ 生成失败:", error.message);
      process.exit(1);
    }
  });

program
  .command("init")
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
