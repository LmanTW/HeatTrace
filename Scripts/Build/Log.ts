// Log
class Log {
  // Add Log
  public static add (content: string): void {
    process.stdout.write(content)
  }

  // Replace Current Log
  public static replace (content: string): void {
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
    process.stdout.write(content)  
  }
}

// Text Color
const TextColor = {
  reset: '\x1b[0m',

  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',

  white: '\x1b[97m',
  black: '\x1b[30m',
  gray: '\x1b[90m'
}

export { Log, TextColor }
