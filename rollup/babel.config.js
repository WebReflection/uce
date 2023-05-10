import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import includePaths from 'rollup-plugin-includepaths';
export default {
  input: './esm/index.js',
  plugins: [
    includePaths({
      include: {},
    }),
    resolve(),
    babel({babelHelpers: 'runtime', presets: ['@babel/preset-env'], plugins: ["@babel/plugin-transform-runtime"]})
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
