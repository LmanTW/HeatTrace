// Component
abstract class Component {
  abstract render (width: number, height: number, lines: string[]): void

  abstract keydown (key: Buffer): void
}

// Component Style
interface ComponentStyle {
  horizontalAlign?: 'left' | 'center' | 'right',
  verticalAlign?: 'top' | 'center' | 'bottom'
}

export { Component, ComponentStyle }
