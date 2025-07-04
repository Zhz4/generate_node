# 构建说明

## 安装依赖

```bash
npm install
```

## 构建脚本

### 生产构建（压缩代码）
```bash
npm run build
```
这将清理 `dist` 目录并重新构建所有文件，包含代码压缩、移除 console 语句等优化。

### 开发构建（不压缩）
```bash
npm run build:dev
```
快速构建，不进行代码压缩，保留调试信息。

### 开发模式（监听）
```bash
npm run dev
```
监听文件变化并自动重新构建，不进行代码压缩。

### 清理构建产物
```bash
npm run clean
```
删除 `dist` 目录。

## 构建输出

- `dist/index.js` - 主入口文件
- `dist/cli.js` - CLI 入口文件
- `dist/template/` - 模板文件
- `dist/config/` - 配置文件
- `dist/utils/` - 工具文件

## 发布

运行 `npm publish` 时会自动执行构建（通过 `prepublishOnly` 脚本）。

## 代码压缩特性

生产构建时会自动启用以下优化：

- **代码压缩** - 移除空白字符和换行
- **变量名混淆** - 缩短变量名（保留函数名以确保 CLI 正常工作）
- **死代码消除** - 移除未使用的代码
- **Console 清理** - 移除 `console.log`、`console.info`、`console.debug` 
- **注释移除** - 移除所有注释
- **Debugger 清理** - 移除 `debugger` 语句

## 技术栈

- **Rollup** - 打包工具
- **Babel** - JavaScript 转译
- **Terser** - 代码压缩和优化
- **ESM** - ES 模块格式输出
- **Node 14+** - 目标运行环境 