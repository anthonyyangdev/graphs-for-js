import { describe, it } from 'mocha'
import { expect } from 'chai'
import { GraphType } from '../../src/types/GraphType'
import { GraphBuilder } from '../../index'

const createUnweightedGraph = <V> (nodes: V[], edges: [V, V][], fn?: (v: V) => string) => {
  if (fn != null) {
    return GraphBuilder<V>().withKeyFunction(fn).readonly(nodes).directed.unweighted(edges)
  } else {
    return GraphBuilder<V>().withoutKeyFunction().readonly(nodes).directed.unweighted(edges)
  }
}

const createWeightedGraph = <V, E> (nodes: V[], edges: [V, V, E][], fn?: (v: V) => string) => {
  if (fn != null) {
    return GraphBuilder<V>().withKeyFunction(fn).readonly(nodes).directed.weighted(edges)
  } else {
    return GraphBuilder<V>().withoutKeyFunction().readonly(nodes).directed.weighted(edges)
  }
}

describe('Directed Graphs', function () {
  describe('Unweighted Graphs', function () {
    it('should initiate empty', function () {
      const graph = createUnweightedGraph<number>([], [])
      expect(graph.getGraphType()).equals(GraphType.ReadonlyNonWeightedDirected)

      expect(graph.hasEdge(0, 1)).is.false
      expect(graph.incomingEdgesOf(0).length).equals(0)
      expect(graph.outgoingEdgesOf(0).length).equals(0)
      expect(graph.degreeOf(0)).equals(0)
      expect(graph.inDegreeOf(0)).equals(0)
      expect(graph.outDegreeOf(0)).equals(0)
      expect(graph.contains(0)).is.false

      expect(graph.count()).equals(graph.nodes().length).equals(0)
      expect(graph.edges().length).equals(0)
    })

    it('should load given nodes and edges', function () {
      const graph = createUnweightedGraph<number>([1, 2, 3], [[1, 2], [2, 3], [3, 1]])
      expect(graph.count()).equals(graph.nodes().length).equals(3)
      expect(graph.contains(1, 2, 3)).is.true
      expect(graph.edges().length).equals(3)

      expect(graph.hasEdge(1, 2)).is.true
      expect(graph.hasEdge(2, 3)).is.true
      expect(graph.hasEdge(2, 1)).is.false
      expect(graph.edges().some(x => x.undirected)).is.false
      expect(graph.incomingEdgesOf(0).length).equals(0)
      expect(graph.outgoingEdgesOf(0).length).equals(0)
      expect(graph.incomingEdgesOf(1).length).equals(1)
      expect(graph.outgoingEdgesOf(1).length).equals(1)
    })

    it('should return the correct number of degrees', function () {
      const graph = createUnweightedGraph<number>([1, 2, 3], [[1, 1], [2, 3]])
      expect(graph.degreeOf(1)).equals(2)
      expect(graph.outDegreeOf(1)).equals(1)
      expect(graph.inDegreeOf(1)).equals(1)

      expect(graph.degreeOf(2)).equals(1)
      expect(graph.outDegreeOf(2)).equals(1)
      expect(graph.inDegreeOf(2)).equals(0)

      expect(graph.degreeOf(3)).equals(1)
      expect(graph.outDegreeOf(3)).equals(0)
      expect(graph.inDegreeOf(3)).equals(1)
    })

    it('should load only one node because of key function', function () {
      const graph = createUnweightedGraph<number>([1, 2, 3, 4], [[2, 3], [4, 1]], n => '')
      expect(graph.count()).equals(graph.nodes().length).equals(1)
      expect(graph.contains(1)).is.true
      expect(graph.contains(2, 3, 4)).is.true
      expect(graph.edges().length).equals(1)
      expect(graph.hasEdge(2, 4)).is.true
    })
  })
  describe('Weighted graphs', function () {
    it('should instantiate empty', function () {
      const graph = createWeightedGraph<number, number>([], [])
      expect(graph.getGraphType()).equals(GraphType.ReadonlyWeightedDirected)
      expect(graph.hasEdge(0, 1)).is.false
      expect(graph.getEdgeValue(0, 0)).is.undefined
      expect(graph.incomingEdgesOf(0).length).equals(0)
      expect(graph.outgoingEdgesOf(0).length).equals(0)
      expect(graph.degreeOf(0)).equals(0)
      expect(graph.inDegreeOf(0)).equals(0)
      expect(graph.outDegreeOf(0)).equals(0)
      expect(graph.contains(0)).is.false

      expect(graph.count()).equals(graph.nodes().length).equals(0)
      expect(graph.edges().length).equals(0)
    })

    it('should get edges arrays with values', function () {
      const graph = createWeightedGraph<number, number>(
        [0, 1, 2, 3], [
          [0, 1, 3], [0, 2, 0.5], [0, 3, 5]
        ])
      expect(graph.incomingEdgesOf(1).every(x => x.value != null)).is.true
      expect(graph.incomingEdgesOf(2).every(x => x.value != null)).is.true
      expect(graph.incomingEdgesOf(3).every(x => x.value != null)).is.true
      expect(graph.outgoingEdgesOf(0).map(x => x.value).sort()).deep.equals([0.5, 3, 5])

      expect(graph.edges().map(x => x.value).sort()).deep.equals([0.5, 3, 5])
      expect(graph.edges().some(x => x.undirected)).is.false

      expect(graph.hasEdge(0, 1, 0.3)).is.false
      expect(graph.hasEdge(1, 0, 0.3)).is.false
      expect(graph.hasEdge(1, 0, 3)).is.false
    })
  })
})
