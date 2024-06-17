// Component
abstract class Component {
  abstract render (width: number, height: number, lines: string[]): void
  abstract keydown? (key: Buffer): void
}

export { Component }
