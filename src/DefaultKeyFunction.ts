import * as Collections from 'typescript-collections'

/**
 * The default Key Function.
 * @param i
 */
export function defaultToKeyFunction (i: unknown) {
  if (typeof i === 'symbol') {
    return i.toString()
  } else if (i !== null && typeof i === 'object') {
    return Collections.util.makeString(i)
  } else {
    return `${i}`
  }
}
