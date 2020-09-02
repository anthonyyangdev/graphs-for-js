import { describe, it } from 'mocha'
import { expect } from 'chai'
import { GraphBuilder, GraphUtil } from '../../index'
import { AdjacencyMatrixResult } from '../../src/util/ToAdjacenyMatrix'
import { ReadonlyGraph } from '../../src/types/GraphSystem'

const automateCheck = <V, E> (
  g: ReadonlyGraph<V, E>,
  result: AdjacencyMatrixResult<V, E>
) => {
  const { nodeToIndex, nodeIndexPairs, indexToNode, valueMatrix, matrix } = result
  const nodes = g.nodes()
  const edges = g.edges()

  expect(Object.keys(nodeToIndex).length).equals(g.count())
  if (g.count() > 0) {
    expect(nodeToIndex).to.have.all.keys(nodes.map(n => g.toKeyFn(n)))
  } else {
    expect(Object.keys(nodeToIndex).length).equals(0)
  }
  expect(nodeIndexPairs.length).equals(g.count())
  expect(g.contains(...nodeIndexPairs.map(p => p.node))).is.true
  for (let i = 0; i < indexToNode.length; i++) {
    const n = indexToNode[i]
    expect(g.contains(n)).is.true
    expect(nodeToIndex[g.toKeyFn(n)]).equals(i)
    expect(nodeIndexPairs.some(({ node, index }) => {
      return i === index && g.toKeyFn(node) === g.toKeyFn(n)
    })).is.true
  }
  const row: Record<number, boolean> = {}
  const col: Record<number, boolean> = {}
  for (const { source, value, target } of edges) {
    const i = nodeToIndex[g.toKeyFn(source)]
    const j = nodeToIndex[g.toKeyFn(target)]
    row[i] = true; col[j] = true
    expect(matrix[i][j]).is.true
    expect(valueMatrix[i][j]).equals(value)
    if (g.isUndirected) {
      row[j] = true; col[i] = true
      expect(matrix[j][i]).is.true
      expect(valueMatrix[j][i]).equals(value)
    }
  }
  for (let i = 0; i < matrix.length; i++) {
    const rows = matrix[i]
    for (let j = 0; j < rows.length; j++) {
      if (!row[i] && !col[j]) {
        expect(matrix[i][j]).equals(false)
        expect(valueMatrix[i][j]).is.undefined
      }
    }
  }
}

describe('Convert to adjacency matrix', function () {
  describe('Undirected graphs', function () {
    describe('without weights', function () {
      it('should work without weights', function () {
        const graph = GraphBuilder<number, number>()
          .withoutKeyFunction().readonly([1, 2, 3, 4])
          .undirected.unweighted([[1, 2], [2, 3], [3, 4]])
        const results = GraphUtil.toAdjacencyMatrix(graph)
        automateCheck(graph, results)
      })
    })
    describe('with weights', function () {
      it('should work with empty graph', function () {
        const graph = GraphBuilder<number, number>()
          .withoutKeyFunction().readonly([])
          .undirected.weighted([])
        const results = GraphUtil.toAdjacencyMatrix(graph)
        expect(results.valueMatrix.length).equals(0)
        expect(results.matrix.length).equals(0)
        expect(Object.keys(results.nodeToIndex).length).equals(0)
        expect(results.nodeIndexPairs.length).equals(0)
        expect(results.indexToNode.length).equals(0)
        automateCheck(graph, results)
      })

      it('should work with weights', function () {
        const graph = GraphBuilder<number, number>()
          .withoutKeyFunction().readonly([1, 2, 3, 4])
          .undirected.weighted([[1, 2, 3], [2, 3, 5], [3, 4, 7]])
        const results = GraphUtil.toAdjacencyMatrix(graph)
        automateCheck(graph, results)
      })
    })
  })

  describe('Directed graphs', function () {
    describe('With weights', function () {
      it('should work with weights', function () {
        const graph = GraphBuilder<number, number>()
          .withoutKeyFunction().readonly([1, 2, 3, 4])
          .directed.weighted([[1, 2, 3], [2, 3, 5], [3, 4, 7]])
        const { matrix, valueMatrix, nodeIndexPairs, nodeToIndex, indexToNode } = GraphUtil.toAdjacencyMatrix(graph)
        expect(valueMatrix[nodeToIndex[1]][nodeToIndex[2]]).equals(3)
        expect(valueMatrix[nodeToIndex[2]][nodeToIndex[3]]).equals(5)
        expect(valueMatrix[nodeToIndex[3]][nodeToIndex[4]]).equals(7)
        expect(matrix[nodeToIndex[1]][nodeToIndex[2]]).is.true
        expect(matrix[nodeToIndex[2]][nodeToIndex[3]]).is.true
        expect(matrix[nodeToIndex[3]][nodeToIndex[4]]).is.true

        expect(matrix[nodeToIndex[2]][nodeToIndex[1]]).is.false
        expect(matrix[nodeToIndex[3]][nodeToIndex[2]]).is.false
        expect(matrix[nodeToIndex[4]][nodeToIndex[3]]).is.false
        automateCheck(graph, { matrix, valueMatrix, nodeIndexPairs, nodeToIndex, indexToNode })
      })
    })

    describe('Without weights', function () {
      it('should work without weights', function () {
        const graph = GraphBuilder<string>()
          .withoutKeyFunction().readonly(['A', 'B', 'C', 'D'])
          .directed.unweighted([['A', 'C'], ['B', 'D'], ['C', 'D']])
        const { matrix, valueMatrix, nodeIndexPairs, nodeToIndex, indexToNode } = GraphUtil.toAdjacencyMatrix(graph)
        expect(matrix[nodeToIndex.A][nodeToIndex.C]).is.true
        expect(matrix[nodeToIndex.B][nodeToIndex.D]).is.true
        expect(matrix[nodeToIndex.C][nodeToIndex.D]).is.true

        expect(valueMatrix[nodeToIndex.A][nodeToIndex.C]).is.undefined
        expect(valueMatrix[nodeToIndex.B][nodeToIndex.D]).is.undefined
        expect(valueMatrix[nodeToIndex.C][nodeToIndex.D]).is.undefined
        for (const p of nodeIndexPairs) {
          expect(p.index).equals(nodeToIndex[p.node])
        }
        automateCheck(graph, { matrix, valueMatrix, nodeIndexPairs, nodeToIndex, indexToNode })
      })
    })
  })
})
