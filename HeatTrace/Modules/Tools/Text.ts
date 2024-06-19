import wcwidth from 'wcwidth'

// Text
class Text {
  public static bold (text: string) {return `\x1b[1m${text}\x1b[22m`}
  public static underline (text: string) {return `\x1b[4m${text}\x1b[24m`}
  public static strikethrough (text: string) {return `\x1b[9m${text}\x1b[29m`}

  public static red (text: string) {return `\x1b[31m${text}\x1b[0m`}
  public static yellow (text: string) {return `\x1b[33m${text}\x1b[0m`}
  public static green (text: string) {return `\x1b[32m${text}\x1b[0m`}
  public static cyan (text: string) {return `\x1b[36m${text}\x1b[0m`}
  public static blue (text: string) {return `\x1b[34m${text}\x1b[0m`}
  public static purple (text: string) {return `\x1b[35m${text}\x1b[0m`}

  public static brightRed (text: string) {return `\x1b[91m${text}\x1b[0m`}
  public static brightYellow (text: string) {return `\x1b[93m${text}\x1b[0m`}
  public static brightGreen (text: string) {return `\x1b[92m${text}\x1b[0m`}
  public static brightCyan (text: string) {return `\x1b[96m${text}\x1b[0m`}
  public static brightBlue (text: string) {return `\x1b[94m${text}\x1b[0m`}
  public static brightPurple (text: string) {return `\x1b[95m${text}\x1b[0m`}

  public static white (text: string) {return `\x1b[37m${text}\x1b[0m`}
  public static black (text: string) {return `\x1b[30m${text}\x1b[0m`}
  public static gray (text: string) {return `\x1b[30m${text}\x1b[0m`}
}

// Background
class Background {
  public static red (text: string) {return `\x1b[41m${text}\x1b[0m`}
  public static yellow (text: string) {return `\x1b[43m${text}\x1b[0m`}
  public static green (text: string) {return `\x1b[42m${text}\x1b[0m`}
  public static cyan (text: string) {return `\x1b[46m${text}\x1b[0m`}
  public static blue (text: string) {return `\x1b[44m${text}\x1b[0m`}
  public static purple (text: string) {return `\x1b[45m${text}\x1b[0m`}

  public static white (text: string) {return `\x1b[47m${text}\x1b[0m`}
  public static black (text: string) {return `\x1b[40m${text}\x1b[0m`}
}

// Measure The Text
function measureText (text: string): number {
  let characters: string = '' 

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\x1b') {
      const oldIndex = i

      while (text[i] !== 'm' && i < text.length) i++

      if (text[i] !== 'm') i = oldIndex
    } else characters += text[i]
  }

  return wcwidth(characters)
}

// Place A Text
function placeText (width: number, base: string, text: string, x: number): string {
  const originalLength = measureText(text)

  if (x + originalLength > width) {
    const length = (x + originalLength) - width

    while (measureText(text) > length && text.length > 0) text = text.substring(0, text.length - 1)
  } else if (x < 0) {
    const length = originalLength + x

    while (measureText(text) > length && text.length > 0) text = text.substring(1, text.length)

    x = 0
  }

  let start: string = ''
  let end: string = ''

  for (let i = 0; measureText(start) < x && i < base.length; i++) start += base[i]
  for (let i = base.length - 1; wcwidth(end) < width - (x + measureText(text)) && i >= 0; i--) end += base[i]

  return start + text + end 
}

export { Text, Background, measureText, placeText }
