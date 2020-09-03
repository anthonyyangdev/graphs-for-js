import { ReadonlyGraph } from '../types/GraphSystem'

export type AdjacencyMatrixResult<V, E> = {
  matrix: boolean[][],
  valueMatrix: (E | undefined)[][],
  nodeToIndex: Record<string, number>
  indexToNode: V[],
  nodeIndexPairs: {node: V, index: number}[]
}

/**
 * Creates an adjacency matrix representation of the graph.
 * @param g
 */
export const toAdjacencyMatrix = <V, E> (
  g: ReadonlyGraph<V, E>
): AdjacencyMatrixResult<V, E> => {
  const nodeCount = g.count()
  const nodeToIndex: Record<string, number> = {}
  const nodeIndexPairs: {node: V, index: number}[] = []
  const indexToNode: V[] = []

  const valueMatrix: (E | undefined)[][] = new Array(nodeCount).fill(0)
    .map(() => new Array(nodeCount).fill(undefined))
  const matrix: boolean[][] = new Array(nodeCount).fill(0)
    .map(() => new Array(nodeCount).fill(false))

  let index = 0
  for (const n of g.nodes()) {
    nodeToIndex[g.toKeyFn(n)] = index
    nodeIndexPairs.push({ node: n, index })
    indexToNode.push(n)
    index++
  }

  for (const { source, target, value, undirected } of g.edges()) {
    const i = nodeToIndex[g.toKeyFn(source)]
    const j = nodeToIndex[g.toKeyFn(target)]
    valueMatrix[i][j] = value
    matrix[i][j] = true
    if (undirected) {
      valueMatrix[j][i] = value
      matrix[j][i] = true
    }
  }

  return {
    matrix, valueMatrix, nodeToIndex, indexToNode, nodeIndexPairs
  }
}
