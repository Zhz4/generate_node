export default {
    name: 'backend',
    configList: ["main_config.json","edit_config.json"],
    templates: [{
        name: 'template_api',
        outpushName: '/api/[apiFileName].js', // []中为config文件中的变量，可以替换成对应的value
    },
    {
        name: "template_table",
        outpushName: 'tableConfig.jsx',
    },
    {
        name: "template_vue",
        outpushName: 'index.vue',
    },
    {
        name: "template_edit",
        outpushName: '/components/EditModal.vue',
    }
    ],
}