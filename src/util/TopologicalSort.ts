import { ReadonlyGraph } from '../types/GraphSystem'

export const topologicalSort = <V, E> (
  g: ReadonlyGraph<V, E>,
  compare: (a: V, b: V) => number
): undefined | V[] => {
  return undefined
}
