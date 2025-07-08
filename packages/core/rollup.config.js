import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";
import typescript from "@rollup/plugin-typescript";

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
  typescript({
    tsconfig: "tsconfig.json",
  }),
  isProduction &&
    terser({
      compress: {
        drop_debugger: true,
      },
    }),
];

const copyPlugin = copy({
  targets: [{ src: "lib/initTemplate", dest: "dist" }],
});

export default [
  // 主入口 - ES 模块格式
  {
    input: "lib/index.ts",
    output: {
      file: "dist/index.js",
      format: "es",
      chunkFileNames: "chunks/[name].[hash].js",
    },
    plugins: [...basePlugins, copyPlugin],
  },
  // 主入口 - CommonJS 格式
  {
    input: "lib/index.ts",
    output: {
      file: "dist/index.cjs",
      format: "cjs",
    },
    plugins: [...basePlugins, copyPlugin],
  },
  // CLI 入口 - ES 模块格式
  {
    input: "lib/cli.ts",
    output: {
      file: "dist/cli.js",
      format: "es",
    },
    plugins: basePlugins,
  },
  // CLI 入口 - CommonJS 格式
  {
    input: "lib/cli.ts",
    output: {
      file: "dist/cli.cjs",
      format: "cjs",
    },
    plugins: basePlugins,
  },
];
