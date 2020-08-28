import { it, describe } from 'mocha'
import { expect } from 'chai'
import { DirectedGraph } from '../src/DirectedGraph'
import * as GraphUtil from '../src/GraphUtil'
import { UndirectedGraph } from '../src/UndirectedGraph'

describe('Test GraphUtil function', function () {
  describe('Check for cycles', function () {
    describe('Directed graphs', function () {
      it('should find a basic cycle', function () {
        const graph = new DirectedGraph<number>()
        const nodes = [0, 1, 2, 3, 4]
        graph.insert(...nodes)
        for (let i = 0; i < nodes.length; i++) {
          graph.connect(i, (i + 1) % nodes.length)
        }
        expect(GraphUtil.hasCycle(graph)).to.be.true
      })
      it('should not find a cycle', function () {
        const graph = new DirectedGraph<number>()
        const nodes = [0, 1, 2, 3, 4]
        graph.insert(...nodes)
        for (let i = 0; i < nodes.length - 1; i++) {
          graph.connect(i, i + 1)
        }
        expect(GraphUtil.hasCycle(graph)).to.be.false
      })
      it('should find inner-loop', function () {
        const graph = new DirectedGraph<number>()
        const nodes = [0, 1, 2, 3, 4]
        graph.insert(...nodes)
        graph.connect(0, 1)
        graph.connect(1, 2)
        graph.connect(2, 4)
        graph.connect(4, 5)
        graph.connect(4, 3)
        graph.connect(3, 2)
        expect(GraphUtil.hasCycle(graph)).to.be.true
      })
      it('should not find a loop in a branch merge', function () {
        const graph = new DirectedGraph<number>()
        const nodes = [0, 1, 2, 3, 4]
        graph.insert(...nodes)
        graph.connect(0, 1)
        graph.connect(1, 2)
        graph.connect(1, 3)
        graph.connect(2, 4)
        graph.connect(3, 4)
        graph.connect(4, 5)
        expect(GraphUtil.hasCycle(graph)).to.be.false
      })
      it('should find no cycles in an empty graph', function () {
        const graph = new DirectedGraph()
        expect(GraphUtil.hasCycle(graph)).to.be.false
      })
      it('should find no cycles in a singleton graph with no edges', function () {
        const graph = new DirectedGraph()
        graph.insert(3)
        expect(GraphUtil.hasCycle(graph)).to.be.false
      })
      it('should find a cycle in a graph with self-loop', function () {
        const graph = new DirectedGraph()
        graph.insert(3)
        graph.connect(3, 3)
        expect(GraphUtil.hasCycle(graph)).to.be.true
      })
    })

    describe('Undirected cycles', function () {
      it('should find basic cycles', function () {
        const graph = new UndirectedGraph<number>()
        graph.insert(1, 2, 3, 4)
        graph.connect(1, 2)
        graph.connect(2, 3)
        graph.connect(3, 4)
        graph.connect(1, 3)
        expect(GraphUtil.hasCycle(graph)).is.true
      })

      it('should not find a cycle in a horseshoe graph', function () {
        const graph = new UndirectedGraph<number>()
        graph.insert(1, 2, 3, 4)
        graph.connect(1, 2)
        graph.connect(2, 3)
        graph.connect(3, 4)
        expect(GraphUtil.hasCycle(graph)).is.false
      })
    })
  })

  describe('Test find path algorithm', function () {
    describe('Directed graph', function () {
      it('should find path for straight line', function () {
        const graph = new DirectedGraph<number>()
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
        const graph = new DirectedGraph<number>()
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
        const graph = new DirectedGraph<number>()
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
        const graph = new DirectedGraph<number>()
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
        const graph = new UndirectedGraph<number>()
        graph.insert(1, 2)
        graph.connect(1, 2)

        const result = GraphUtil.findShortestPath(graph, 1, 1)
        expect(result.path).deep.equals([1])
        expect(result.pathSize).equals(0)
      })
    })
  })
})
