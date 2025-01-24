import { readdirSync, statSync } from 'fs';
import { resolve, join } from 'path';
import { build } from 'esbuild';
import { ck } from './log';
import ora from 'ora';

const libFolder = resolve('lib');
const files = readdirSync(libFolder).filter(file => /.*?js/.test(file));

async function minifyFiles() {
  for (const file of files) {
    const filePath = join(libFolder, file);
    const stats = statSync(filePath);

    if (stats.isFile()) {
      const spinner = ora(ck.yellowBright(`Minifying ${file}`)).start();
      await build({
        entryPoints: [filePath],
        outfile: filePath,
        minify: true,
        allowOverwrite: true,
        // format: 'esm',
        bundle: false // Tidak menggabungkan, hanya meminify file
      });

      spinner.succeed(` ${ck.greenBright(`Minified!`)} ${join('lib', file)}`);
    }
  }
}

minifyFiles().catch(err => {
  console.error(ck.red('Error during minification:'), err);
  process.exit(1);
});
