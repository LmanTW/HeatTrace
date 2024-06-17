import wcwidth from 'wcwidth'

// Measure A Text
export default (text: string): number => {
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
