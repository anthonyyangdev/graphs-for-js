import { describe, it } from 'mocha'
import { expect } from 'chai'
import range from '../common/range'
import { Graph, GraphUtil } from '../../index'

describe('Test find path algorithm', function () {
  const gen = new Graph<number>().noKey()

  describe('Directed graph', function () {
    it('should return no path result if nodes do not exist', function () {
      const graph = gen.directed.unweighted()
      graph.insert(0, 1, 2)
      graph.connect(0, 1); graph.connect(1, 2)
      const result = GraphUtil.findShortestPath(graph, -1, 3)
      expect(result.pathSize).equals(-1)
      expect(result.path).deep.equals([])
    })

    it('should find path for straight line', function () {
      const graph = gen.directed.unweighted()
      const nodes = [0, 1, 2, 3]
      graph.insert(...nodes)
      for (let i = 0; i < 4; i++) {
        graph.connect(i, (i + 1) % nodes.length)
      }
      const result = GraphUtil.findShortestPath(graph, nodes[0], nodes[nodes.length - 1])
      expect(result.path).deep.equals([0, 1, 2, 3])
      expect(result.pathSize).equals(3)
    })

    it('should find shortest path in branches', function () {
      const graph = gen.directed.unweighted()
      /*
       |-- 0 -- 1 -- 4
       |   |         |
       |   2         |
       |             |
       |------- 3 ---|
       |
       5
       */
      graph.insert(0, 1, 2, 3, 4, 5)
      graph.connect(0, 1)
      graph.connect(0, 2)
      graph.connect(0, 3)
      graph.connect(1, 4)
      graph.connect(4, 3)
      graph.connect(3, 5)

      const result = GraphUtil.findShortestPath(graph, 0, 5)
      expect(result.path).deep.equals([0, 3, 5])
      expect(result.pathSize).equals(2)
    })

    it('should not find a path when no edges, and should find path of self-loop', function () {
      const graph = gen.directed.unweighted()
      /*
       |---|
       0 --> 1 --> 2 --> 3 <-|
       ^-----|
       */
      graph.insert(0, 1, 2, 3)
      graph.connect(0, 1)
      graph.connect(1, 2)
      graph.connect(2, 3)
      graph.connect(3, 2)
      graph.connect(3, 3)

      const result = GraphUtil.findShortestPath(graph, 3, 1)
      expect(result.path).deep.equals([])
      expect(result.pathSize).equals(-1)

      const selfLoopResult = GraphUtil.findShortestPath(graph, 3, 3)
      expect(selfLoopResult.path).deep.equals([3])
      expect(selfLoopResult.pathSize).equals(0)
    })

    it('should find shortest path', function () {
      const graph = gen.directed.unweighted()
      graph.insert(1, 2, 3, 4)
      graph.connect(1, 2)
      graph.connect(1, 4)
      graph.connect(1, 3)
      graph.connect(2, 4)
      graph.connect(3, 4)
      const result = GraphUtil.findShortestPath(graph, 1, 4)
      expect(result.path).deep.equals([1, 4])
      expect(result.pathSize).equals(1)
    })
  })

  describe('Test undirected graph', function () {
    it('should find shortest path to self', function () {
      const graph = gen.undirected.unweighted()
      graph.insert(1, 2)
      graph.connect(1, 2)

      const result = GraphUtil.findShortestPath(graph, 1, 1)
      expect(result.path).deep.equals([1])
      expect(result.pathSize).equals(0)
    })

    it('should find a path from 1 to 7', function () {
      const graph = gen.undirected.unweighted()
      graph.insert(...range.number(1, 7))
      graph.connect(1, 4, 3)
      graph.connect(4, 6, 6)
      graph.connect(6, 7, 9)
      graph.connect(1, 2, 3)
      graph.connect(4, 5, 2)
      graph.connect(5, 2, 1)
      graph.connect(5, 7, 1)
      graph.connect(3, 1, 3)
      graph.connect(2, 3, 4)
      graph.connect(3, 4, 1)
      graph.connect(3, 5, 2)

      const result = GraphUtil.findShortestPath(graph, 1, 7)
      const { pathSize } = result!
      expect(pathSize).equals(3)
    })
  })
})
