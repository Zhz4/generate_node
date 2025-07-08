import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";

// 判断是否是生产环境
const isProduction = process.env.NODE_ENV === "production";

// 基础插件配置
const basePlugins = [
  typescript({
    // 在编译时检查错误
    check: true,
    // 在编译时检查错误
    abortOnError: true,
    // 使用 tsconfig.json 中的声明文件输出目录
    useTsconfigDeclarationDir: true,
    tsconfig: "tsconfig.json",
    // 清理缓存
    clean: true,
  }),
  resolve({
    preferBuiltins: true,
  }),
  commonjs(),
  json(),
  babel({
    babelHelpers: "bundled",
    exclude: "node_modules/**",
  }),
  isProduction &&
    terser({
      ecma: 2017,
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
      dir: "dist",
      format: "esm",
      chunkFileNames: "chunks/[name].[hash].js",
      entryFileNames: "index.js",
    },
    plugins: [...basePlugins, copyPlugin],
  },
  // CLI 入口 - ES 模块格式
  {
    input: "lib/cli.ts",
    output: {
      file: "dist/cli.js",
      format: "esm",
    },
    plugins: basePlugins,
  },
  // 声明文件
  {
    input: "lib/index.ts",
    output: {
      dir: "dist",
      format: "esm",
      chunkFileNames: "chunks/[name].[hash].d.ts",
      entryFileNames: "index.d.ts",
    },
    plugins: [dts()],
  },
];
