export default function replaceVariables(template, config) {
    const newTemplate = {}; // 创建一个新对象来存储替换后的值
    Object.entries(template).forEach(([key, value]) => {
        // 去除[]包含的值
        const needreplace = value.match(/\[(.*?)\]/);
        if (needreplace) {
            const newValue = config[needreplace[1]]; // 从 config 中获取新值
            // 替换方括号内的内容
            const result = value.replace(/\[.*?\]/, newValue);
            newTemplate[key] = result; // 将结果存入新对象
        } else {
            newTemplate[key] = value; // 如果没有需要替换的内容，保持原值
        }
    });

    return newTemplate; // 返回新的 template 对象
}
