# OA新后台代码生成器（node）
## 前言
为什么要写这个程序？  
在写OA后台的时候会发现其实很多工作都是重复性的，后台的格式，模版基本都是大差不差，区别只是在业务逻辑上的不同。因此，像这些重复性的工作，其实可以让程序一键生成，我们只需要关注业务逻辑本身，通过逻辑修改代码，大大提高了工作效率，减少重复性工作
## 使用说明
只需要在配置文件中加入自己需要的内容即可  
其中`edit_config.json`中配置的是编辑表单中的模版  
```json
{
  "form_item_list": [
    {
      "label": "工号",
      "key": "user"
    }
  ],
  // 搜索筛选项
  "tool_button_list": [
    {
      "button_name": "导入数据",
      // 按钮名称
      "handler": "handleInput",
      // 事件函数名称
      "icon_component": "ArrowDownCircleOutline"
      // icon名称
    }
    // 工具行
  ],
  "table_list": [
    {
      "label": "工号",
      "key": "user"
    }
    // jsx中表格字段
  ],
  "apiFileName": "", // api的文件名
  "apiList": [] // 这里的是api配置
}
```
执行命令：  
 `pnpm install`   
 `pnpm run start`  
包含 `index.vue`和`tableConfig.jsx`,`api`,`EditModel`文件，只需要将该文件复制粘贴到后台项目中便可以执行
注意：代码是没有进行格式化的（但任然不影响阅读），因此需要在vscode中格式化一下代码（最好！）

## 待更新内容

- 搜索筛选项中目前只有 input 模版，后续会加入下拉，时间，部门等常用模版 下拉✔️
- 编辑弹窗也是经常会使用到的功能，后续加入编辑弹窗模版 ✔️
- api文件以及常用增删改查逻辑等... ️✔️查询，删除
## 演示
![演示gif](./doc/img/18.gif)

## 新增模版
1. 首先需要在template/ejs中新建.ejs文件，其模版语法可参看 ejs模版语法
2. 模版中的变量从何而来？
   - 模版中对应的变量名其实就是 `/config/xxx.json `配置文件中的各个key
3. 关联模版以及对应的配置文件还有输出文件
   - 在`/relations/modules/xxx.js`中可以用于关联模版以及配置文件，有时候多个模版之间可能会用到同样的config文件，因此在configList中可以关联多个模版，实际上templates 中以及configList 中是相互关联的，templates中的所有模版都可以使用configList中的变量。因此，在配置configList文件中的key不能重复。`templates` 中的`outpushName`用于配置输出路径
4. 注册执行任务，在`config/task：writeCoreModules`中可以用于配置需要执行的任务。其任务名对应 `/relations/modules/xxx.js` 中的name 

## 对比原来python版本中的更新点
1. 生成的代码是完全已经格式化好的，也就是说可以完全按照模版中的格式来进行生成
2. 代码逻辑可以写在[ejs](https://ejs.bootcss.com/#install)模版中，开发起来更加顺手和简洁
3. 新增了任务配置项，可以选择指定多种模版生成
4. 模版以及配置项之间关系更加清晰

最重要的是新增以及修改模版更加方便了！！

## 根据配置文件生成的代码展示
[查看代码](./doc/demoCode.md)
[配置介绍](./doc/Instructions.md)

