/*
 * @Description: 
 * @Author: tianyuexian
 * @Date: 2022-04-22 15:08:20
 * @LastEditors: tianyuexian
 * @LastEditTime: 2022-04-25 15:54:17
 */
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
export default {
  input: 'index.js',
  output: {
    file: 'bundle.js',
    format: 'esm',
    name: 'MyBundle'
  },
  plugins: [
    babel({ 
      exclude: 'node_modules/**',
      presets:[["@babel/preset-env",{'useBuiltIns': 'usage','corejs': 3}]],
      plugins: [
        ["@babel/plugin-proposal-decorators",{"legacy":true}]
      ]
    }),
    nodeResolve(),
    commonjs(),
    terser()
  ]
}
