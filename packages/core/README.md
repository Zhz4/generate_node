# @generate_node/core

一个灵活的代码生成工具，支持可配置的模版和设置。

## 特性

- 🎯 **灵活配置**: 支持外部配置文件和模版
- 🔧 **可扩展**: 易于添加新的模版和配置
- 📦 **模块化**: 支持模块化的代码生成
- 🚀 **高性能**: 内置模版缓存和优化
- 🔨 **工具函数**: 提供丰富的模版工具函数

## 安装

```bash
npm install @generate_node/core
# 或者
pnpm add @generate_node/core
```

## 快速开始

```javascript
import { OAGenerator } from '@generate_node/core';

// 创建生成器实例
const generator = new OAGenerator({
  configPath: './config',    // 配置文件路径
  templatePath: './template', // 模版文件路径
  outputPath: './output'     // 输出路径
});

// 生成代码
await generator.generate();
```

## API 文档

### OAGenerator

主要的代码生成器类。

#### 构造函数

```javascript
new Generator(options)
```

**参数:**
- `options.configPath` (string): 配置文件路径，默认为当前工作目录
- `options.templatePath` (string): 模版文件路径，默认为当前工作目录
- `options.outputPath` (string): 输出路径，默认为 `./output`

#### 方法

##### `generate(options)`

生成代码。

**参数:**
- `options.modules` (Array): 要生成的模块列表（可选）
- `options.config` (Object): 额外的配置对象（可选）

**返回:** Promise<void>

##### `setConfigPath(path)`

设置配置文件路径。

**参数:**
- `path` (string): 配置文件路径

##### `setTemplatePath(path)`

设置模版文件路径。

**参数:**
- `path` (string): 模版文件路径

##### `setOutputPath(path)`

设置输出路径。

**参数:**
- `path` (string): 输出路径

## 配置文件

### 主配置文件 (main_config.json)

包含表单字段、工具按钮、表格列等基础配置。

### 模块配置文件 (modules.json)

定义模块的配置文件列表和模版列表：

```json
[
  {
    "name": "backend",
    "configList": [
      "config/main_config.json",
      "config/edit_config.json"
    ],
    "templates": [
      {
        "name": "template_api",
        "outputName": "output/${apiFileName}.js"
      }
    ]
  }
]
```

### 任务配置文件 (task.yml)

定义哪些模块需要生成代码：

```yaml
writeCoreModules:
  - backend
  - frontend
  - api
```

## 模版系统

使用 EJS 模版引擎，支持：

- 条件渲染
- 循环渲染
- 变量替换
- 工具函数

### 内置工具函数

在模版中可以使用以下工具函数：

- `jsonToJsFormat(json)`: JSON 转 JS 格式
- `capitalize(str)`: 首字母大写
- `camelCase(str)`: 驼峰命名转换
- `snakeCase(str)`: 下划线命名转换
- `kebabCase(str)`: 短横线命名转换

### 模版示例

```ejs
// 生成的API文件: <%= apiFileName %>.js
const express = require('express');
const router = express.Router();

<% main_form_item_list.forEach(item => { %>
// 字段: <%= item.label %> (key: <%= item.key %>)
<% }); %>

module.exports = router;
```

## 工具类

### ConfigManager

配置管理器，负责加载和合并配置文件。

### TemplateEngine

模版引擎，负责渲染模版文件。

### FileUtils

文件工具类，提供文件操作的辅助方法。