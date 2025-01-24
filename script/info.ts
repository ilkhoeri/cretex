import { name, version } from '../package.json' with { type: 'json' };
import ora from 'ora';
import { ck } from './log';

const format = process.argv[2];

function logInfo(format: string) {
  const spinner = ora(`Building for ${format}...`).start();

  setTimeout(() => {
    spinner.succeed(`${ck.greenBright.bold('Success!')} Build for ${ck.cyanBright(format)} completed.\n`);
  }, 1750);
}

if (!format) {
  console.error(ck.red.bold('Error: No format specified.'));
  process.exit(1);
}

console.log(ck.cyanBright('>'), ck.yellowBright(`${name}@${version}`), ck.cyanBright.bold(`build:${format}\n`));

console.log(`Starting build process for`, ck.cyanBright(format), `format...`);

logInfo(format);
