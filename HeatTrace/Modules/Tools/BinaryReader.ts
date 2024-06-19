// Binary Reader
export default class {
  private _data: string = ''
  private _index: number = 0

  constructor (data: Buffer) {
    data.forEach((byte) => this._data += byte.toString(2).padStart(8, '0'))
  }

  // Read A Byte
  public readByte () {
    return parseInt(this._read(8), 2) 
  }

  // Read A 2-Byte Little Endian
  public readShort () {
    return littleEndianToNumber([this._read(8), this._read(8)], 8)
  }

  // Read A 4-Byte Little Endian
  public readInteger () {
    return littleEndianToNumber([this._read(8), this._read(8), this._read(8), this._read(8)], 8)
  }

  // Read A 8-Byte Little Endian
  public readLong () {
    return littleEndianToNumber([this._read(8), this._read(8), this._read(8), this._read(8), this._read(8), this._read(8), this._read(8), this._read(8)], 8) 
  }

  // Read A ULEB128
  public readULEB128 () {
    const bytes: string[] = []

    while (true) {
      const chunk = this._read(8)

      bytes.push(chunk.substring(1, 8))

      if (chunk[0] === '0') break
    }

    return littleEndianToNumber(bytes, 7)
  }

  // Read A String
  public readString () {
    if (this.readByte() === 11) {
      const length = this.readULEB128()

      let bytes: number[] = []

      for (let i = 0; i < length; i++) bytes.push(parseInt(this._read(8), 2))

      return Buffer.from(bytes).toString('utf8')
    } else return ''
  }

  // Read
  private _read (length: number): string {
    const chunk = this._data.substring(this._index, this._index + length)

    this._index += length

    return chunk
  }
}

// Little Endian to Number
function littleEndianToNumber (bytes: string[], byteLength: number): number {
  let result: number = 0
  let shift: number = 0

  for (let i = 0; i < bytes.length; i++) {
    const byte = parseInt(bytes[i], 2);

    result |= (byte & ((1 << byteLength) - 1)) << shift
    shift += byteLength
  }

  return result
}
