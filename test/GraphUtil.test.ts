import { it, describe } from 'mocha'
import { expect } from 'chai'
import { DirectedGraph } from '../src/DirectedGraph'
import * as GraphUtil from '../src/GraphUtil'

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
})