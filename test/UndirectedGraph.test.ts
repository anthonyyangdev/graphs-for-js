import { it, describe } from 'mocha'
import { expect } from 'chai'
import { UndirectedGraph } from '../src/UndirectedGraph'
import { GraphType } from '../src/GraphType'

describe('Undirected graph test suite', function () {
  it('should instantiate', function () {
    const graph = new UndirectedGraph()
    expect(graph.edges().length).equals(0)
    expect(graph.nodes().size()).equals(0)
    expect(graph.getGraphType()).equals(GraphType.NonValueUndirected)
  })
  it('should treat edges as both forward and backward', function () {
    const graph = new UndirectedGraph()
    graph.insert(0, 1, 2)
    graph.connect(0, 1)
    graph.connect(1, 2)
    graph.connect(2, 0)
    for (let i = 0; i < 3; i++) {
      const source = i; const target = (i + 1) % 3
      expect(graph.hasEdge(source, target)).is.true
      expect(graph.hasEdge(target, source)).is.true
    }
    expect(graph.count()).equals(3)
    expect(graph.edges().length).equals(3)

    expect(graph.disconnect(1, 0)).is.true
    expect(graph.hasEdge(0, 1)).is.false
    expect(graph.edges().length).equals(2)

    expect(graph.disconnect(2, 1)).is.true
    expect(graph.disconnect(0, 2)).is.true
    for (let i = 0; i < 3; i++) {
      const source = i; const target = (i + 1) % 3
      expect(graph.hasEdge(source, target)).is.false
      expect(graph.hasEdge(target, source)).is.false
    }
    expect(graph.edges().length).equals(0)
  })

  it('should affect outgoing and incoming edge results', function () {
    const graph = new UndirectedGraph<number>()
    graph.insert(1, 2, 3)
    graph.connect(1, 1)
    graph.connect(1, 2)
    graph.connect(1, 3)

    const outgoing = graph.outgoingEdgesOf(1)
    const incoming = graph.incomingEdgesOf(1)
    expect(outgoing.length).equals(incoming.length).equals(3)
    expect(outgoing.every(x => incoming.some(y => {
      return y.target === x.source && y.source === x.target
    }))).is.true
    expect(incoming.every(x => outgoing.some(y => {
      return y.target === x.source && y.source === x.target
    }))).is.true
  })
})
