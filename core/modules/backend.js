export default {
    name: 'backend',
    configList: ["main_config.json","edit_config.json"],
    templates: [{
        name: 'template_api',
        outpushName: '/api/[apiFileName].js',
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
        outpushName: '/component/EditModal.vue',
    }
    ],
}