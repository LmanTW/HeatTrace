// Map Range
export default (value: number, oldMin: number, oldMax: number, newMin: number, newMax: number): number => {
  const normalizedValue = (value - oldMin) / (oldMax - oldMin)
    
  return normalizedValue * (newMax - newMin) + newMin
}
