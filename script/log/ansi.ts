// ANSI escape codes
const ansiColors = {
  color: {
    default: '\x1b[39m',
    reset: '\x1b[0m',
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    /** Bright black (alias for grey) */
    blackBright: '\x1b[90m',
    /** Alias for bright black */
    grey: '\x1b[90m',
    redBright: '\x1b[91m',
    greenBright: '\x1b[92m',
    yellowBright: '\x1b[93m',
    blueBright: '\x1b[94m',
    magentaBright: '\x1b[95m',
    cyanBright: '\x1b[96m',
    whiteBright: '\x1b[97m',
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
    /** Bright black background */
    bgBlackBright: '\x1b[100m',
    /** Alias for bright black background */
    bgGrey: '\x1b[100m',
    bgRedBright: '\x1b[101m',
    bgGreenBright: '\x1b[102m',
    bgYellowBright: '\x1b[103m',
    bgBlueBright: '\x1b[104m',
    bgMagentaBright: '\x1b[105m',
    bgCyanBright: '\x1b[106m',
    bgWhiteBright: '\x1b[107m'
  },
  effect: {
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    italic: '\x1b[3m',
    underline: '\x1b[4m',
    blink: '\x1b[5m',
    inverse: '\x1b[7m',
    hidden: '\x1b[8m',
    strikethrough: '\x1b[9m',
    /** Not widely supported */
    doubleUnderline: '\x1b[21m',
    reset: '\x1b[0m'
  }
};

export { ansiColors };
