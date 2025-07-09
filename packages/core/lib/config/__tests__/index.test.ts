import { describe, it, expect, vi } from "vitest";
import { ConfigManager } from "../index";
import fs from "fs";
import * as utils from "../../utils";

describe("测试加载配置", () => {
  it("应该加载配置", async () => {
    const configManager = new ConfigManager();
    const config = await configManager.loadConfig();
    expect(config).toBeDefined();
  });

  it("当配置文件存在时，应该返回配置对象", async () => {
    // 模拟文件存在
    vi.spyOn(fs.promises, "readFile").mockResolvedValueOnce(`{
        "name": "backend",
        "configList": ["config/main_config.json", "config/edit_config.json"],
        "outputDir": "output",
        "templates": [{
            "name": "template/template_api",
            "outputName": "api/\${apiFileName}.js"
        }]
    }`);
    vi.spyOn(utils, "fileExists").mockResolvedValueOnce(true);

    const configManager = new ConfigManager();
    const config = await configManager.loadConfig();
    expect(config).toEqual({
      name: "backend",
      configList: ["config/main_config.json", "config/edit_config.json"],
      outputDir: "output",
      templates: [
        { name: "template/template_api", outputName: "api/\${apiFileName}.js" },
      ],
    });
  });

  it("当配置文件不存在时，应该返回错误", async () => {
    // 模拟文件不存在
    vi.spyOn(utils, "fileExists").mockResolvedValueOnce(false);
    const configManager = new ConfigManager();
    const config = await configManager.loadConfig();
    expect(config).toBeInstanceOf(Error);
    expect((config as Error).message).toBe("配置文件不存在");
  });
});

describe("测试配置字段缺失", () => {
  it("当配置文件不存在name时，应该返回错误", async () => {
    vi.spyOn(fs.promises, "readFile").mockResolvedValueOnce(`{
            "configList": ["config/main_config.json", "config/edit_config.json"],
            "outputDir": "output",
            "templates": [{
                "name": "template/template_api",
                "outputName": "api/\${apiFileName}.js"
            }]
        }`);
    vi.spyOn(utils, "fileExists").mockResolvedValueOnce(true);
    const configManager = new ConfigManager();
    const config = await configManager.loadConfig();
    expect(config).toBeInstanceOf(Error);
    expect((config as Error).message).toBe(
      '配置文件格式错误: 字段 "name" 错误: Required，请检查配置文件'
    );
  });

  it("当配置文件不存在configList时，应该返回错误", async () => {
    vi.spyOn(fs.promises, "readFile").mockResolvedValueOnce(`{
        "name": "backend",
        "outputDir": "output",
        "templates": [{
            "name": "template/template_api",
            "outputName": "api/\${apiFileName}.js"
        }]
    }`);
    vi.spyOn(utils, "fileExists").mockResolvedValueOnce(true);
    const configManager = new ConfigManager();
    const config = await configManager.loadConfig();
    expect(config).toBeInstanceOf(Error);
    expect((config as Error).message).toBe(
      '配置文件格式错误: 字段 "configList" 错误: Required，请检查配置文件'
    );
  });
});
