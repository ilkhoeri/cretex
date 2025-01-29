// rollup.config.mjs
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index.mjs',
        format: 'es',
        sourcemap: false,
        exports: 'named'
      },
      {
        file: 'lib/index.umd.js',
        name: 'Cretex',
        format: 'umd',
        sourcemap: false,
        exports: 'named'
        // globals: {
        //   'tailwind-merge': 'tailwindMerge'
        // }
      }
    ],
    // external: ['tailwind-merge'],
    plugins: [
      typescript({
        tsconfig: './configs/tsconfig.esm.json',
        sourceMap: false
      })
    ]
  }
];
