import typescript from 'rollup-plugin-typescript2';
import cleanup from 'rollup-plugin-cleanup';
import license from 'rollup-plugin-license';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { fileURLToPath } from 'url';

export default {
  input: ['gas/index.ts'],
  output: {
    file: 'dist_clasp/bundle.js',
    format: 'iife',
  },
  plugins: [
    cleanup({
      extensions: ['.ts'],
    }),
    license({
      banner: {
        content: {
          file: fileURLToPath(new URL('license-header.txt', import.meta.url)),
        },
      },
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
