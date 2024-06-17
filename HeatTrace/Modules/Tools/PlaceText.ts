// Place A Text
export default (text: string, x: number) => {
  if (x >= 0) return ' '.repeat(x) + text
  else {
    const length = measureText(text) + x

    while (measureText(text) > length) text = text.substring(1, text.length)

    return text
  }
}

import measureText from './MeasureText'
