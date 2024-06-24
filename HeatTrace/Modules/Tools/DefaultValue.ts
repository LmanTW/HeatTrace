// Default Value
export default <T> (value: undefined | T, defaultValue: T): T => {
  return (value === undefined) ? defaultValue : value
}
