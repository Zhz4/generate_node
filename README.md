# Generate Node

一个基于 Monorepo 架构的灵活代码生成工具，支持可配置的模版和设置。

## 🏗️ 项目架构

```
OA_generate_node/
├── packages/
│   └── core/                 # 核心代码生成包
│       ├── lib/              # 核心库代码
│       │   ├── index.js      # 主入口文件
│       │   ├── generator.js  # 代码生成器
│       │   ├── cli.js        # CLI工具
│       │   ├── config/       # 配置管理
│       │   ├── template/     # 模版引擎
│       │   └── utils/        # 工具类
│       ├── examples/         # 配置和模版示例
│       ├── package.json      # 包配置
│       └── README.md         # 包文档
├── examples/                 # 完整使用示例
│   ├── config/               # 配置文件
│   ├── template/             # 模版文件
│   ├── modules.json          # 模块配置
│   ├── task.yml              # 任务配置
│   ├── main.js               # 示例主文件
│   └── package.json          # 示例包配置
├── pnpm-workspace.yaml       # pnpm workspace 配置
└── README.md                 # 项目文档
```

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 运行示例

```bash
cd examples
pnpm start
```

### 3. 安装核心包

```bash
pnpm add @generate_node/core
```

## 📦 包说明

### @generate_node/core

核心代码生成包，提供：

- **OAGenerator**: 主要的代码生成器类
- **ConfigManager**: 配置管理器
- **TemplateEngine**: 模版引擎
- **FileUtils**: 文件工具类
- **CLI工具**: 命令行接口

### examples

完整的使用示例，展示如何：

- 配置项目
- 定义模版
- 生成代码
- 自定义输出

## 🎯 设计理念

### 关注点分离

- **核心功能**: 在 `packages/core` 中，作为独立的npm包
- **配置文件**: 在用户项目中，支持自定义配置
- **模版文件**: 在用户项目中，支持自定义模版
- **示例代码**: 在 `examples` 中，展示最佳实践

### 灵活配置

- **外部配置**: 配置文件不打包在核心包内
- **模版分离**: 模版文件不打包在核心包内
- **路径配置**: 支持自定义配置和模版路径
- **模块化**: 支持按模块生成代码

## 🔧 使用方法

### 编程式使用

```javascript
import { OAGenerator } from '@oa_generate_node/core';

const generator = new OAGenerator({
  configPath: './config',
  templatePath: './template',
  outputPath: './output'
});

await generator.generate();
```

### CLI使用

```bash
# 生成代码
oa-generate generate -c ./config -t ./template -o ./output

# 指定模块
oa-generate generate -m backend,frontend

# 初始化项目
oa-generate init
```

## 📋 配置文件

### 主配置文件 (main_config.json)

定义表单字段、工具按钮、表格列等基础配置。

### 模块配置文件 (modules.json)

定义模块的配置文件列表和模版列表。

### 任务配置文件 (task.yml)

定义哪些模块需要生成代码。

## 🎨 模版系统

- **EJS模版引擎**: 支持条件渲染、循环渲染、变量替换
- **内置工具函数**: 提供常用的字符串转换函数
- **模版缓存**: 提高渲染性能
- **多扩展名支持**: 支持 .ejs、.html、.htm 文件

## 🛠️ 开发指南

### 添加新功能

1. 在 `packages/core/lib` 中添加新的模块
2. 在 `packages/core/lib/index.js` 中导出新模块
3. 在 `examples` 中添加使用示例
4. 更新文档

### 发布包

```bash
cd packages/core
npm publish
```