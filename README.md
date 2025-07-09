<div align="center">
  <h3>代码生成框架</h3>
  <p>一个基于 Monorepo 架构的灵活代码生成工具，专为后台管理系统设计</p>
  
  [![NPM Version](https://img.shields.io/npm/v/@smooth_zhz/generate_node-core)](https://www.npmjs.com/package/@smooth_zhz/generate_node-core)
  [![Node.js Version](https://img.shields.io/node/v/@smooth_zhz/generate_node-core)](https://nodejs.org)
  [![License](https://img.shields.io/npm/l/@smooth_zhz/generate_node-core)](LICENSE)
</div>

## 📖 项目简介

Generate Node 是一个高度可自定义的代码生成工具。它能够根据配置文件自动生成重复性的代码。例如：例如前端页面，对接的 API 文件，以及表格等。设置好模版后，只需修改配置文件，便可以一键生成对应的模块的代码

### 💡 为什么选择 Generate Node？

在开发 后台系统时，我们经常面临以下问题：

- 大量重复的 CRUD 页面编写
- 标准化的表单和表格组件
- 相似的 API 接口定义

Generate Node 通过模版化的方式，让您只需要修改配置文件，其他重复性工作交给工具自动完成。

## ✨ 核心特性

- 🔧 **高度可配置**: 支持自定义模版和配置文件
- 📦 **NPM 包支持**: 可全局安装使用，也可作为项目依赖
- 🎨 **EJS 模版引擎**: 强大的模版语法，支持条件渲染和循环
- 💻 **CLI 工具**: 提供便捷的命令行工具
- 📊 **开发模版监控**: 实时编译成代码效果，配合vue/react等可实时查看模版效果

## 🚀 快速开始

### CLI 使用（ 推荐 ）

```bash
# 全局安装依赖
npm install -g @smooth_zhz/generate_node-core
```

#### 1. 初始化项目

创建基础配置文件和示例模版：

```bash
generate init
```

#### 2. 生成代码

根据配置文件和模版生成目标代码：

```bash
generate code
```

#### 3. 开发模式（写模版时使用）

启动实时监听和自动生成

- 自动监听配置文件变化
- 保存后实时生成代码
- 配合 Vue/React 项目的热更新，即时预览生成效果

```bash
generate dev
```

### 项目中使用

```bash
# 项目中安装依赖
npm install @smooth_zhz/generate_node-core
```

```js
import { generator } from "@smooth_zhz/generate_node-core";

// 获取所有可用的模块
const modules = await generator.getAvailableModules();
// 生成代码
await generator.generate(); // 生成配置中所有模块
// 生成配置中指定模块
await generator.generate(["backend"]); // 生成配置中所有模块

console.log(modules);
```

## 📋 配置文件说明

### 📁 目录结构

- **template/** - 模版文件目录，使用 [EJS](https://ejs.bootcss.com/#promo) 语法编写
- **config/** - 配置文件目录，存储变量数据供模版使用
- **generate.config.json** - 主配置文件，连接模版和配置

### ⚙️ 主配置文件参数

```javascript
{
  name: "模块名称",
  configList: ["配置文件路径数组"],
  templates: [
    {
      name: "模版文件路径",
      outputName: "生成代码输出路径"
    }
  ]
}
```
