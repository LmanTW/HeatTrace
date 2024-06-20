// Generate ID
export default (length: number, keys: string[]): string => {
  let id = generateAnID(length)

  while (keys.includes(id)) id = generateAnID(length)

  return id
}

// Generate An ID
function generateAnID (length: number): string {
  let string: string = ''

  for (let i = 0; i < length; i++) string += letters[getRandom(0, letters.length - 1)]

  return string
}

import getRandom from './GetRandom'

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
