/**
 * Creates a sequence of characters
 * @param start
 * @param end
 * @param increment
 */
function * charRange (start: string, end: string, increment: number = 1) {
  if (!Number.isInteger(increment)) { throw new Error('Increment is not an integer') }
  if (start.length !== 1 || end.length !== 1) throw new Error('Ends are not characters')
  const first = start.charCodeAt(0)
  const last = end.charCodeAt(0)
  for (let i = first; i <= last; i += increment) {
    yield String.fromCharCode(i)
  }
}

/**
 * Creates a sequence of numbers
 * @param start
 * @param end
 * @param increment
 */
function * numberRange (start: number, end: number, increment: number = 1) {
  for (let i = start; i <= end; i += increment) {
    yield i
  }
}

const range = {
  char: charRange,
  number: numberRange
}

export default range
