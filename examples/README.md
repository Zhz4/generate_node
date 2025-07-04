# OA Generator 使用示例

这个示例展示了如何使用 `@oa_generate_node/core` 包来生成代码。

## 目录结构

```
examples/
├── config/              # 配置文件目录
│   ├── main_config.json # 主配置文件
│   ├── edit_config.json # 编辑配置文件
│   └── task.yml        # 任务配置文件
├── template/           # 模版文件目录
│   ├── template_api.ejs    # API模版
│   ├── template_table.ejs  # 表格模版
│   ├── template_edit.ejs   # 编辑表单模版
│   └── template_vue.ejs    # Vue组件模版
├── output/             # 生成的代码输出目录
├── modules.json        # 模块配置文件
├── task.yml           # 任务配置文件
├── main.js            # 主入口文件
└── package.json       # 依赖配置
```

## 使用方法

### 1. 安装依赖

```bash
pnpm install
```

### 2. 运行生成器

```bash
# 生成代码
pnpm start

# 或者使用别名
pnpm generate
```

### 3. 查看生成的文件

生成的代码会输出到 `output/` 目录中。

## 配置说明

### 主配置文件 (`config/main_config.json`)

包含表单字段、工具按钮、表格列等配置信息。

### 编辑配置文件 (`config/edit_config.json`)

包含编辑表单的特定配置。

### 任务配置文件 (`task.yml`)

定义哪些模块需要生成代码。

### 模块配置文件 (`modules.json`)

定义模块的配置文件列表和模版列表。

## 自定义配置

你可以通过修改 `main.js` 中的配置来自定义生成行为：

```javascript
const generator = new OAGenerator({
  configPath: path.join(__dirname, './'),           // 配置文件路径
  templatePath: path.join(__dirname, './template'), // 模版文件路径
  outputPath: path.join(__dirname, './output')      // 输出路径
});

// 自定义配置
const customConfig = {
  projectName: 'OA管理系统',
  author: '开发团队',
  version: '1.0.0',
  description: '这是一个自动生成的OA管理系统'
};
```

## 添加新的模版

1. 在 `template/` 目录中创建新的 `.ejs` 文件
2. 在 `modules.json` 中添加对应的模版配置
3. 运行生成器即可使用新模版

## 添加新的配置

1. 在 `config/` 目录中创建新的配置文件
2. 在 `modules.json` 中的 `configList` 数组中添加配置文件路径
3. 配置会自动合并到模版数据中

## 变量替换

在模版配置中可以使用 `${变量名}` 的形式来进行变量替换，例如：

```json
{
  "name": "template_api",
  "outputName": "output/${apiFileName}.js"
}
```

其中 `${apiFileName}` 会被配置文件中的 `apiFileName` 字段替换。 