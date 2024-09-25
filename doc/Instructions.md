# 模版配置介绍
## 主页模版
### 1. `main_form_item_list `
普通的表单
```json
{
    "label": "工号",
    "key": "jobNum"
}
```
时间范围表单
- type 时间范围类型
- startField 初始时间的字段名
- endField 结束时间的字段名
- timeformat 存储到数据库中的时间格式
```json
{
    "label": "入职时间",
    "key": "entryDate",
    "type": "daterange",
    "startField": "entryDateStartTime",
    "endField": "entryDateEndTime",
    "timeformat": "YYYY-MM-DD"
}
```
下拉筛选表单
- type 下拉类型
- options 下拉选项
```json
{
    "label": "是否在职",
    "key": "user",
    "type": "select",
    "options": [{
        "label": "在职",
        "value": "1"
    },
    {
        "label": "离职",
        "value": "0"
    }
}
```

### 2. tool_button_list
普通功能按钮
```json
{
    "button_name": "批量删除",
    "handler": "handleBatchDelete",
    "icon_component": "ArrowDownCircleOutline"
}
```
导入功能按钮
- type 导入类型
```json
{
    "button_name": "导入数据",
    "type": "import",
    "handler": "handleInput"
}
```
下载导入模版
- type 导入模版类型
- link 下载地址
```json
{
    "button_name": "下载导入模版",
    "handler": "handleDownloadTemplate",
    "type":"importTemplate",
    "link":"http://soundasia.oss-cn-shenzhen.aliyuncs.com/colleagueBar/xlsx/2023/12/26/1703554813483.xlsx",
    "icon_component": "ArrowDownCircleOutline"
}
```
导出功能按钮
- type 导出类型
- exportFileName 导出文件名
```json
{
    "button_name": "导出数据",
    "handler": "handleExport",
    "type":"export",
    "exportFileName": "劳动合同续签",
    "icon_component": "ArrowDownCircleOutline"
}
```
### 3.table_list
普通列表
```json
{
    "label": "姓名",
    "key": "name"
}
```
### 4. apiFileName api文件名
### 5. apiList
普通api
- remark api中文件注释
- url 请求地址
- method 请求方法
- handlerName 方法名
```json
{
    "_comment": "普通接口",
    "remark": "普通",
    "url": "/ckEmployeeUtilityBills/handlelist",
    "method": "post",
    "handlerName": "exportData"
}
```
查询列表api
- command 列表标识
```json
{
    "_comment": "查询接口",
    "remark": "列表",
    "command": "select",
    "url": "/contractManagementRecord/list",
    "method": "get",
    "handlerName": "list"
}
```
删除api
- command 删除标识
```json
{
    "_comment": "删除接口",
    "remark": "删除",
    "command": "delete",
    "url": "/contractManagementRecord/deleteContractRecord",
    "method": "post",
    "handlerName": "deleteContractRecord"
}
```
导入api
- command 导入标识
```json
{
    "_comment": "导入接口",
    "remark": "导入",
    "command": "import",
    "url": "/ckEmployeeUtilityBills/importExcel",
    "method": "post",
    "handlerName": "importExcel"
}
```
导出api
- command 导出标识
```json
{
    "_comment": "导出接口",
    "remark": "导出",
    "command": "export",
    "url": "/ckEmployeeUtilityBills/export",
    "method": "post",
    "handlerName": "exportData"
}
```

## 编辑模版
### edit_form_item_list
普通表单
```json
{
    "label": "部门",
    "key": "deptName"
}
```
时间表单
- type 时间类型
- timeformat 时间格式
```json
{
    "label": "入职日期",
    "key": "entryDate",
    "type": "date",
    "timeformat": "YYYY-MM-DD"
}
```
下拉表单
- type 下拉类型
- options 下拉选项
```json
{
    "label": "最近续签状态",
    "key": "latestContractStatus",
    "type": "select",
    "options": [{
        "label": "续签",
        "value": "1"
    },
    {
        "label": "不续签",
        "value": "0"
    }
    ]
}
```