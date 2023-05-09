import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';
export default {
  input: './esm/index.js',
  plugins: [
    alias({
      entries: [{
        find: '@ungap/create-content',
        replacement: 'node_modules/@ungap/degap/create-content.js'
      }],
    }),
    resolve(),
    terser()
  ],
  context: 'null',
  moduleContext: 'null',
  output: {
    esModule: false,
    exports: 'named',
    file: './new.js',
    format: 'iife',
    name: 'uce'
  }
};
