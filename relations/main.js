import {
    loadAndMergeJsonFiles
} from "./hooks/useReadMoreConifg.js";
import useReadModules from './hooks/useReadModules.js'
import outFile from "../common/writeFile.js";
import renderTemplate from "../template/index.js";
import replaceVariables from "./utils/replaceVariables.js";
import {
    loadYamlConfig
} from "../common/readFile.js";

export default async function () {
    const modulesList = await useReadModules();
    modulesList.forEach(async (item) => {
        const task = await loadYamlConfig("task.yml");
        if (!task.writeCoreModules.includes(item.name)) {
            return
        }
        // 读取配置文件
        const config = await loadAndMergeJsonFiles(item.configList);
        // 读取模板
        item.templates.forEach(async (template) => {
            // 替换模板配置中的变量
            const newTemplate = replaceVariables(template, config)
            // 渲染模板
            const html = renderTemplate(newTemplate.name, config);
            // 写入文件
            outFile(newTemplate.outpushName, html);
        })
    });
}