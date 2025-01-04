import typescript from 'rollup-plugin-typescript2';
import cleanup from 'rollup-plugin-cleanup';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: ['src/index.ts'],
  output: {
    file: 'dist/bundle/bundle.js',
    format: 'iife',
  },
  plugins: [
    cleanup({
      extensions: ['.ts'],
    }),
    nodeResolve({
      preferBuiltins: false,
    }),
    commonjs(),
    typescript(),
    json(),
  ],
  context: 'this',
};
