import { defineConfig } from 'tsup';

export default defineConfig({
  name: 'build',
  globalName: 'cretex', // Menggunakan output dalam browser
  entry: ['src/index.ts'], // Entry utama
  format: ['cjs', 'esm'], // Hasilkan format CommonJS dan ESM
  dts: {
    resolve: true, // Hasilkan tipe deklarasi
    entry: 'src/index.ts' // Lokasi deklarasi tipe
  },
  outDir: 'dist', // Output folder
  target: 'es2020', // Target JavaScript
  sourcemap: true, // Tambahkan sourcemap Untuk debugging
  minify: true, // Minifikasi output
  splitting: false, // Tidak memisahkan file
  clean: true, // Bersihkan folder output sebelum build
  legacyOutput: false, // Tambahkan dukungan output kompatibel dengan CommonJS
  treeshake: true, // Aktifkan tree-shaking
  cjsInterop: true,
  esbuildOptions(options) {
    options.banner = {
      js: `'use strict';`
    };
    options.footer = {
      js: `if (typeof module !== 'undefined') module.exports = cretex;`
    };
    options.define = {
      ...options.define,
      'process.env.NODE_ENV': JSON.stringify('production')
    };
  },
  // outExtension: ({ format }) => {
  //   return {
  //     js: format === 'esm' ? '.mjs' : '.cjs'
  //   };
  // },
  onSuccess: 'echo "Build completed!"'
});
