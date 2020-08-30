import { describe, it } from 'mocha'
import { expect } from 'chai'
import { GraphType } from '../src/types/GraphType'
import { WeightedUndirectedGraph } from '../src/mutable/WeightedUndirectedGraph'

describe('Weighted undirected graph', function () {
  it('should instantiate', function () {
    const graph = new WeightedUndirectedGraph<number, number>()
    expect(graph.edges().length).equals(0)
    expect(graph.nodes().length).equals(0)
    expect(graph.getGraphType()).equals(GraphType.WeightedUndirected)
  })

  it('should return false for failed unconnected edges', function () {
    const graph = new WeightedUndirectedGraph<number, number>()
    graph.insert(0, 1)
    expect(graph.connect(-2, 2, 5)).is.false
    expect(graph.connect(0, 2, 0.75)).is.false
    expect(graph.connect(0, 1, 0.75)).is.true
    expect(graph.connect(1, 0, 0.75)).is.false

    expect(graph.connect(1, 0, 100)).is.true

    expect(graph.disconnect(0, 10, -1)).is.false
    expect(graph.disconnect(1, 0, -1)).is.false
    expect(graph.disconnect(1, 0, 100)).is.true

    expect(graph.hasEdge(0, 1)).is.false
    expect(graph.hasEdge(1, 0)).is.false
  })

  it('should have two way edges', function () {
    const graph = new WeightedUndirectedGraph<number, number>()
    graph.insert(0, 1)
    expect(graph.connect(0, 1, -1)).to.be.true
    expect(graph.hasEdge(0, 1)).to.be.true
    expect(graph.hasEdge(0, 1, -1)).to.be.true
    expect(graph.hasEdge(1, 0, -1)).to.be.true

    expect(graph.degreeOf(1)).equals(1)
    expect(graph.inDegreeOf(1)).equals(1)
    expect(graph.outDegreeOf(1)).equals(1)
    expect(graph.getEdgeValue(0, 1)).equals(-1)
    expect(graph.getEdgeValue(1, 0)).equals(-1)

    expect(graph.connect(0, 1, 1)).to.be.true
    expect(graph.hasEdge(0, 1)).to.be.true
    expect(graph.hasEdge(0, 1, 1)).to.be.true
    expect(graph.hasEdge(1, 0, 1)).to.be.true
    expect(graph.getEdgeValue(1, 0)).equals(1)
    expect(graph.getEdgeValue(1, 0)).equals(1)

    const edges = graph.edges()
    expect(edges.length).equals(1)
    expect(edges.every(e => e.undirected)).is.true
  })
})
