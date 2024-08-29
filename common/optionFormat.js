/**
 * 将json格式转成js格式
 * 1. key不带双引号
 * 2. 值为单引号
 */
export function jsonToJsFormat(json) {
    // 使用 JSON.parse 解析 JSON 字符串
    const obj = typeof json === 'string' ? JSON.parse(json) : json;
    function convert(value) {
        if (typeof value === 'object' && value !== null) {
            // 如果是数组，递归处理每个元素
            if (Array.isArray(value)) {
                return '[' + value.map(convert).join(', ') + ']';
            }
            // 如果是对象，处理键值对
            return '{' + Object.entries(value).map(([key, val]) => {
                // 处理键和值
                const formattedKey = key; // 键不带双引号
                const formattedValue = typeof val === 'string' ? `'${val}'` : convert(val);
                return `${formattedKey}: ${formattedValue}`;
            }).join(', ') + '}';
        }
        // 处理非对象（数字、布尔值等）
        return value;
    }
    return convert(obj);
}