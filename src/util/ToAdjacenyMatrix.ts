import { ReadonlyGraph } from '../types/GraphSystem'

export type AdjacencyMatrixResult<V, E> = {
  matrix: boolean[][],
  valueMatrix: (E | undefined)[][],
  nodeToIndex: Record<string, number>
  indexToNode: V[],
  nodeIndexPairs: {node: V, index: number}[]
}

export const toAdjacencyMatrix = <V, E> (
  g: ReadonlyGraph<V, E>
): AdjacencyMatrixResult<V, E> => {
  return {
    matrix: [[]],
    valueMatrix: [[]],
    nodeToIndex: {},
    indexToNode: [],
    nodeIndexPairs: []
  }
}
