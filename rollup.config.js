import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'index.ts', // 入口文件
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs', // CommonJS 格式
      sourcemap: true,
    },
    {
      file: 'dist/index.mjs',
      format: 'esm', // ES Module 格式
      sourcemap: true,
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd', // UMD 格式
      name: 'JnAxios', // UMD 模块名称
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({
      preferBuiltins: true,
      browser: true
    }), // 解析 node_modules 中的模块
    commonjs(), // 转换 CommonJS 模块为 ES6
    json(), // 处理 JSON 文件
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      exclude: 'node_modules/**'
    }), // 处理 TypeScript
  ],
};