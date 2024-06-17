// Generate An ID
export default (length: number, keys: string[], type?: 'number' | 'alphabet' | 'both'): string => {
  let id = generateAnID(length, type || 'both')

  while (keys.includes(id)) id = generateAnID(length, type || 'both')

  return id
}

// Generate An ID (Can be repeated)
function generateAnID (length: number, type?: 'number' | 'alphabet' | 'both'): string {
  let string: string = ''

  for (let i = 0; i < length; i++) {
    if (type === 'number') string += number[getRandom(0, number.length - 1)]
    else if (type === 'alphabet') string += alphabet[getRandom(0, alphabet.length - 1)]
    else string += both[getRandom(0, both.length - 1)]
  }

  return string
}

import getRandom from './GetRandom'

const number: string = '1234567890'
const alphabet: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const both: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
