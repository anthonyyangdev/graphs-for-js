import { describe, it } from 'mocha'
import { expect } from 'chai'
import { GraphType } from '../src/types/GraphType'
import { WeightedDirectedGraph } from '../src/mutable/DirectedGraphs'

describe('Weighted directed graph', function () {
  it('should instantiate', function () {
    const graph = new WeightedDirectedGraph<number, number>()
    expect(graph.edges().length).equals(0)
    expect(graph.nodes().length).equals(0)
    expect(graph.count()).equals(0)
    expect(graph.getGraphType()).equals(GraphType.WeightedDirected)
  })

  it('should include values in edges', function () {
    const graph = new WeightedDirectedGraph<number, number>()
    graph.insert(0, 1, 2)
    expect(graph.connect(0, 1, 5)).to.be.true
    expect(graph.connect(1, 2, 10)).to.be.true

    expect(graph.edges().length).equals(2)
    expect(graph.nodes().length).equals(3)
    expect(graph.count()).equals(3)

    expect(graph.hasEdge(0, 1)).to.be.true
    expect(graph.hasEdge(0, 1, 5)).to.be.true
    expect(graph.hasEdge(1, 0, 5)).to.be.false
    expect(graph.hasEdge(1, 2)).to.be.true
    expect(graph.hasEdge(2, 1, 10)).to.be.false
    expect(graph.edges().every(e => !e.undirected)).is.true
  })

  it('should replace the value in edges with connect', function () {
    const graph = new WeightedDirectedGraph<number, number>()
    graph.insert(0, 1)
    graph.connect(0, 1, 10)
    expect(graph.hasEdge(0, 1, 10)).to.be.true

    expect(graph.connect(0, 1, 15)).to.be.true
    expect(graph.hasEdge(0, 1, 10)).to.be.false
    expect(graph.hasEdge(0, 1, 15)).to.be.true
  })

  it('should return false for no modification', function () {
    const graph = new WeightedDirectedGraph<number, number>()
    graph.insert(0, 1)
    expect(graph.connect(0, 2, 0.5)).is.false
    expect(graph.connect(0, 1, 1)).is.true
    expect(graph.connect(0, 1, 1)).is.false
  })

  it('should return false when disconnecting nonexistent node pairs', function () {
    const graph = new WeightedDirectedGraph<number, number>()
    graph.insert(0, 1)
    graph.connect(0, 1, 0.5)
    expect(graph.disconnect(0, 2)).is.false
    expect(graph.contains(0)).is.true
    expect(graph.disconnect(0, 1, 0.75)).is.false
    expect(graph.disconnect(0, 1)).is.true
  })

  it('should get the value of an edge', function () {
    const graph = new WeightedDirectedGraph<{
      value: number,
      id: string
    }, string>(i => i.id)
    const node1 = { value: 3, id: '0' }
    const node2 = { value: 5, id: '1' }
    graph.insert(node1, node2)
    graph.connect(node1, node2, 'hello world')
    expect(graph.getEdgeValue(node1, node2)).equals('hello world')
    expect(graph.getEdgeValue(node1, node1)).is.undefined

    const outgoing = graph.outgoingEdgesOf(node1)
    expect(outgoing.every(e => !e.undirected)).is.true
    expect(outgoing.length).equals(1)
    expect(outgoing[0].value).equals('hello world')

    const incoming = graph.incomingEdgesOf(node1)
    expect(incoming.length).equals(0)

    expect(graph.incomingEdgesOf(node2).every(e => !e.undirected)).is.true
    expect(graph.incomingEdgesOf(node2).length).equals(1)
    expect(graph.incomingEdgesOf(node2)[0]).deep.equals(outgoing[0])
  })

  it('should remove values', function () {
    const graph = new WeightedDirectedGraph<number, number>()
    graph.insert(0, 1, 2)
    expect(graph.remove(1, 1, 1, 1, 1, 1)).equals(1)
    expect(graph.remove(3, 4, 5, 6)).equals(0)
    expect(graph.remove(0, 2)).equals(2)

    expect(graph.count()).equals(0).equals(graph.nodes().length)
  })

  it('should return the correct degree values', function () {
    const graph = new WeightedDirectedGraph<number, number>()
    graph.insert(0, 1, 2, 3)
    graph.connect(0, 1, 0.5)
    graph.connect(0, 2, 0.5)
    graph.connect(3, 0, 0.75)

    expect(graph.degreeOf(0)).equals(3)
    expect(graph.outDegreeOf(0)).equals(2)
    expect(graph.inDegreeOf(0)).equals(1)

    graph.remove(0)
    expect(graph.degreeOf(1)).equals(0)
    expect(graph.degreeOf(2)).equals(0)
    expect(graph.degreeOf(3)).equals(0)
  })
})
