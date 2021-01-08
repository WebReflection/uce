import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import includePaths from 'rollup-plugin-includepaths';
export default {
  input: './esm/index.js',
  plugins: [
    includePaths({
      include: {},
    }),
    resolve(),
    babel({presets: ['@babel/preset-env']})
  ],
  context: 'null',
  moduleContext: 'null',
  output: {
    esModule: false,
    exports: 'named',
    file: './index.js',
    format: 'iife',
    name: 'uce'
  }
};
