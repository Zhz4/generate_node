# OA Generate Node 使用指南

## 架构升级说明

我们已经将原有的架构重新设计为适合npm包的Monorepo结构：

### 🔄 主要变更

1. **核心功能包化**: 将核心功能抽离为独立的npm包 `@oa_generate_node/core`
2. **配置外部化**: 配置文件和模版文件不再打包在核心包内，而是在用户项目中
3. **示例分离**: 提供完整的使用示例在 `examples` 目录中
4. **API标准化**: 提供统一的API接口和CLI工具

### 🏗️ 新架构优势

- **灵活性**: 用户可以完全自定义配置和模版
- **可维护性**: 核心功能与配置分离，易于维护
- **可扩展性**: 易于添加新的模版和配置
- **可发布性**: 核心包可以独立发布到npm

## 快速迁移指南

### 从旧版本迁移

1. **安装新版本**:
   ```bash
   pnpm install
   ```

2. **使用示例**:
   ```bash
   cd examples
   pnpm start
   ```

3. **自定义项目**:
   - 复制 `examples` 目录到你的项目
   - 修改 `config/` 中的配置文件
   - 修改 `template/` 中的模版文件
   - 运行 `pnpm start` 生成代码

### 新项目快速开始

1. **安装核心包**:
   ```bash
   npm install @oa_generate_node/core
   ```

2. **创建项目结构**:
   ```
   my-project/
   ├── config/
   │   ├── main_config.json
   │   └── edit_config.json
   ├── template/
   │   └── *.ejs
   ├── modules.json
   ├── task.yml
   └── generate.js
   ```

3. **编写生成脚本**:
   ```javascript
   import { OAGenerator } from '@oa_generate_node/core';
   
   const generator = new OAGenerator({
     configPath: './config',
     templatePath: './template',
     outputPath: './output'
   });
   
   await generator.generate();
   ```

## 配置文件说明

### modules.json - 模块配置

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

### task.yml - 任务配置

定义哪些模块需要生成代码：

```yaml
writeCoreModules:
  - backend
  - frontend
  - api
```

### main_config.json - 主配置

包含表单字段、工具按钮、表格列等基础配置：

```json
{
  "main_form_item_list": [
    {
      "label": "工号",
      "key": "jobNum"
    }
  ],
  "tool_button_list": [
    {
      "button_name": "导入数据",
      "handler": "handleInput"
    }
  ],
  "table_list": [
    {
      "label": "工号",
      "key": "jobNum"
    }
  ],
  "apiFileName": "dealWithContract",
  "apiList": []
}
```

## 模版系统

### EJS模版语法

```ejs
<!-- 变量输出 -->
<%= apiFileName %>

<!-- 条件渲染 -->
<% if (main_form_item_list.length > 0) { %>
  // 生成表单字段
<% } %>

<!-- 循环渲染 -->
<% main_form_item_list.forEach(item => { %>
  // 字段: <%= item.label %> (key: <%= item.key %>)
<% }); %>
```

### 内置工具函数

```ejs
<!-- JSON格式化 -->
<%= jsonToJsFormat(apiList) %>

<!-- 字符串转换 -->
<%= capitalize(apiFileName) %>      <!-- 首字母大写 -->
<%= camelCase(field_name) %>        <!-- 驼峰命名 -->
<%= snakeCase(fieldName) %>         <!-- 下划线命名 -->
<%= kebabCase(fieldName) %>         <!-- 短横线命名 -->
```

## CLI工具

### 安装CLI工具

```bash
npm install -g @oa_generate_node/core
```

### 使用CLI

```bash
# 生成代码
oa-generate generate -c ./config -t ./template -o ./output

# 指定模块
oa-generate generate -m backend,frontend

# 初始化项目
oa-generate init
```

## 编程式API

### 基本用法

```javascript
import { OAGenerator } from '@oa_generate_node/core';

const generator = new OAGenerator({
  configPath: './config',
  templatePath: './template',
  outputPath: './output'
});

await generator.generate();
```

### 高级用法

```javascript
import { OAGenerator, ConfigManager, TemplateEngine } from '@oa_generate_node/core';

// 自定义配置管理器
const configManager = new ConfigManager('./config');
const config = await configManager.loadConfig();

// 自定义模版引擎
const templateEngine = new TemplateEngine('./template');
const templates = await templateEngine.getAvailableTemplates();

// 生成特定模块
await generator.generate({
  modules: ['backend', 'frontend'],
  config: { customField: 'customValue' }
});
```

## 常见问题

### Q: 如何添加新的模版？

1. 在 `template/` 目录中创建新的 `.ejs` 文件
2. 在 `modules.json` 中添加对应的模版配置
3. 运行生成器即可使用新模版

### Q: 如何自定义输出路径？

在模版配置中使用变量替换：

```json
{
  "name": "template_api",
  "outputName": "output/${apiFileName}.js"
}
```

### Q: 如何合并多个配置文件？

在 `modules.json` 的 `configList` 数组中添加多个配置文件：

```json
{
  "configList": [
    "config/main_config.json",
    "config/edit_config.json",
    "config/custom_config.json"
  ]
}
```

### Q: 如何跳过某些模块？

修改 `task.yml` 中的 `writeCoreModules` 列表，只包含需要生成的模块。

## 最佳实践

1. **配置文件分离**: 将不同类型的配置分别放在不同的文件中
2. **模版复用**: 创建可复用的模版片段
3. **变量命名**: 使用清晰的变量名，便于模版中使用
4. **版本管理**: 将配置文件和模版文件纳入版本控制
5. **文档更新**: 及时更新配置文件的说明文档

## 扩展开发

### 添加新的工具函数

在 `packages/core/lib/template/engine.js` 中的 `getUtilityFunctions` 方法中添加新函数：

```javascript
getUtilityFunctions() {
  return {
    // 现有函数...
    
    // 新增函数
    myCustomFunction: (input) => {
      // 自定义逻辑
      return processedInput;
    }
  };
}
```

### 添加新的配置管理功能

在 `packages/core/lib/config/manager.js` 中添加新的配置处理方法。

### 添加新的命令行选项

在 `packages/core/lib/cli.js` 中添加新的命令和选项。

## 支持

如有问题，请：

1. 查看 `examples/` 目录中的示例
2. 阅读 `packages/core/README.md` 文档
3. 提交 Issue 到项目仓库
4. 联系开发团队 