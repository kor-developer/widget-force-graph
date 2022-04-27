import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const external = ['react', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-error-boundary'];

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/main.ts',
    external,
    plugins: [
      typescript({
        tsconfig: './tsconfig.lib.json',
      }), // so Rollup can convert TypeScript to JavaScript
    ],
    output: [
      {file: pkg.main, format: 'cjs'},
      {file: pkg.module, format: 'es'},
    ],
  },
];
