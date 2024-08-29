import index from "./template/index.js";
const dd = index("template_vue", {
  form_item_list: [
    {
      label: "BP名字",
      key: "bpName",
    },
    {
      label: "部门/用户",
      key: "name",
    },
  ],
  tool_button_list: [
    {
      button_name: "新增",
      handler: "handleAdd",
      icon_component: "Add",
    },
  ],
  apiFileName:'1212',
  "apiList": [
    {
      "_comment": "查询接口",
      "remark": "列表",
      "command": "select",
      "url": "/contractManagementRecord/list",
      "method": "get",
      "handlerName": "list"
    },
    {
      "_comment": "删除接口",
      "remark": "删除",
      "command": "delete",
      "url": "/contractManagementRecord/deleteContractRecord",
      "method": "post",
      "handlerName": "deleteContractRecord"
    }
  ]
});
const pp  =index("template_table",{
    "table_list": [{
        "label": "部门/用户",
        "key": "deptName"
      },
      {
        "label": "BP",
        "key": "BP"
      }
    ]
})
const cc = index("template_api",{
    "apiFileName": "dealWithContract",
  "apiList": [
    {
      "_comment": "查询接口",
      "remark": "列表",
      "command": "select",
      "url": "/contractManagementRecord/list",
      "method": "get",
      "handlerName": "list"
    },
    {
      "_comment": "删除接口",
      "remark": "删除",
      "command": "delete",
      "url": "/contractManagementRecord/deleteContractRecord",
      "method": "post",
      "handlerName": "deleteContractRecord"
    }
]
})
console.log(cc);
