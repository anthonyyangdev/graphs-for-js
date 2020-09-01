import { ReadonlyGraph } from '../types/GraphSystem'

export const toAdjacencyMatrix = <V, E> (
  g: ReadonlyGraph<V, E>
): {
  matrix: boolean[][],
  valueMatrix: (E | undefined)[][],
  nodeToIndex: Record<string, number>
  indexToNode: V[],
  nodeIndexPairs: {node: V, index: number}[]
} => {
  return {
    matrix: [[]],
    valueMatrix: [[]],
    nodeToIndex: {},
    indexToNode: [],
    nodeIndexPairs: []
  }
}
