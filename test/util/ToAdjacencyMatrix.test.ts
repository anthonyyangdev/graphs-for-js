import { describe, it } from 'mocha'
import { expect } from 'chai'
import { GraphBuilder, GraphUtil } from '../../index'

describe('Convert to adjacency matrix', function () {
  describe('Directed graphs', function () {
    describe('With weights', function () {
      const graph = GraphBuilder<number, number>()
        .withoutKeyFunction().readonly([1, 2, 3, 4])
        .directed.weighted([[1, 2, 3], [2, 3, 5], [3, 4, 7]])
      const { matrix, valueMatrix, nodeIndexPairs, nodeToIndex } = GraphUtil.toAdjacencyMatrix(graph)
      expect(valueMatrix[nodeToIndex[1]][nodeToIndex[2]]).equals(3)
      expect(valueMatrix[nodeToIndex[2]][nodeToIndex[3]]).equals(5)
      expect(valueMatrix[nodeToIndex[3]][nodeToIndex[4]]).equals(7)
      expect(matrix[nodeToIndex[0]][nodeToIndex[1]]).is.true
      expect(matrix[nodeToIndex[1]][nodeToIndex[2]]).is.true
      expect(matrix[nodeToIndex[2]][nodeToIndex[3]]).is.true

      expect(matrix[nodeToIndex[1]][nodeToIndex[0]]).is.false
      expect(matrix[nodeToIndex[2]][nodeToIndex[1]]).is.false
      expect(matrix[nodeToIndex[3]][nodeToIndex[2]]).is.false
    })

    describe('Without weights', function () {
      const graph = GraphBuilder<string>()
        .withoutKeyFunction().readonly(['A', 'B', 'C', 'D'])
        .directed.unweighted([['A', 'C'], ['B', 'D'], ['C', 'D']])
      const { matrix, valueMatrix, nodeIndexPairs, nodeToIndex } = GraphUtil.toAdjacencyMatrix(graph)
      expect(matrix[nodeToIndex.A][nodeToIndex.C]).is.true
      expect(matrix[nodeToIndex.B][nodeToIndex.D]).is.true
      expect(matrix[nodeToIndex.C][nodeToIndex.D]).is.true

      expect(valueMatrix[nodeToIndex.A][nodeToIndex.C]).is.null
      expect(valueMatrix[nodeToIndex.B][nodeToIndex.D]).is.null
      expect(valueMatrix[nodeToIndex.C][nodeToIndex.D]).is.null

      for (const p of nodeIndexPairs) {
        expect(p.index).equals(nodeToIndex[p.node])
      }
    })
  })
})
