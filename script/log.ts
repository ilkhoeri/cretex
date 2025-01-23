import chalk from 'chalk';

function getEnv() {
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }
  return 'development';
}

const log = Object.assign(
  function log(message?: unknown, ...log: unknown[]) {
    if (getEnv() !== 'production') console.log(message, ...log);
  },
  {
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
  }
);

export default log;
