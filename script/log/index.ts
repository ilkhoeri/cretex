import chalk from 'chalk';
import { ansiColors } from './ansi';

function getEnv() {
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }
  return 'development';
}

function logger(message?: unknown, ...log: unknown[]) {
  if (getEnv() !== 'production') console.log(message, ...log);
}

const assignLogger = {
  error: (...args: unknown[]) => {
    if (getEnv() !== 'production') console.log(chalk.red('⛔', ...args));
  },
  warn: (...args: unknown[]) => {
    if (getEnv() !== 'production') console.log(chalk.yellow('⚠️', ...args));
  },
  info: (...args: unknown[]) => {
    if (getEnv() !== 'production') console.log(chalk.green('⚡', ...args));
  },
  success: (...args: unknown[]) => {
    if (getEnv() !== 'production') console.log(chalk.cyan('✨', ...args));
  },
  break: () => {
    if (getEnv() !== 'production') console.log('');
  },
  build: (process: string, ...args: unknown[]) => {
    const logProcess = chalk.grey('[') + process.toUpperCase() + chalk.grey(']');
    if (getEnv() !== 'production') console.log(logProcess, ...args);
  }
};
const log = Object.assign(logger, assignLogger);

type Color = keyof typeof ansiColors.color;
type Effect = keyof typeof ansiColors.effect;
type StyledLogger = {
  (text: string): string;
} & {
  [key in Effect]: StyledLogger;
};

type CK = {
  [key in Color]: StyledLogger;
};

const createStyledLogger = (color?: Color, effect?: Effect) => {
  const colorCode = color ? ansiColors.color[color] : '';
  const effectCode = effect ? ansiColors.effect[effect] : '';
  const resetCode = '\x1b[0m';

  return (text: string) => {
    return `${effectCode}${colorCode}${text}${resetCode}`;
  };
};

export const ck = Object.keys(ansiColors.color).reduce((acc, color) => {
  // @ts-ignore
  acc[color] = (text: string) => createStyledLogger(color as Color)(text);
  return acc;
}, {} as CK);

Object.keys(ansiColors.effect).forEach(effect => {
  Object.keys(ansiColors.color).forEach(color => {
    const colorFn = ck[color as keyof typeof ansiColors.color];
    const effectFn = (text: string) => createStyledLogger(color as Color, effect as Effect)(text);
    // @ts-ignore
    colorFn[effect as Effect] = effectFn;
  });
});

export default log;
