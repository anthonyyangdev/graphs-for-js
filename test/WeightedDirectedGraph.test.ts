import { describe, it } from 'mocha'
import { expect } from 'chai'
import { WeightedDirectedGraph } from '../src/WeightedDirectedGraph'
import { WeightedUndirectedGraph } from '../src/WeightedUndirectedGraph'
import { GraphType } from '../src/types/GraphType'

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
  })
})
