import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

// 判断是否是生产环境
const isProduction = process.env.NODE_ENV === "production";

// 基础插件配置
const basePlugins = [
  resolve({ preferBuiltins: true }),
  commonjs(),
  json(),
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
  }),
  isProduction &&
    terser({
      compress: {
        drop_debugger: true,
      },
    }),
];
export default [
  // 主入口 - 包含文件复制
  {
    input: "lib/index.js",
    output: {
      file: "dist/index.js",
      format: "es",
      sourcemap: true,
    },
    plugins: basePlugins,
  },
  // CLI 入口
  {
    input: "lib/cli.js",
    output: {
      file: "dist/cli.js",
      format: "es",
      sourcemap: true,
    },
    plugins: basePlugins,
  },
];
