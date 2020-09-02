import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Graph } from '../../index'

const createGraph = <V, E> (fn?: (v: V) => string) => {
  if (fn != null) {
    return new Graph<V, E>().keyFn(fn).undirected.weighted()
  } else {
    return new Graph<V, E>().noKey().undirected.weighted()
  }
}

describe('Weighted undirected graph', function () {
  it('should instantiate', function () {
    const graph = createGraph<number, number>()
    expect(graph.edges().length).equals(0)
    expect(graph.nodes().length).equals(0)
    expect(graph.isUndirected).is.true
    expect(graph.isUnweighted).is.false
  })

  it('should return false for failed unconnected edges', function () {
    const graph = createGraph<number, number>()
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
    const graph = createGraph<number, number>()
    graph.insert(0, 1)
    expect(graph.connect(0, 1, -1)).to.be.true
    expect(graph.hasEdge(0, 1)).to.be.true
    expect(graph.hasEdge(0, 1, -1)).to.be.true
    expect(graph.hasEdge(1, 0, -1)).to.be.true

    expect(graph.degreeOf(1)).equals(1)
    expect(graph.inDegreeOf(1)).equals(1)
    expect(graph.outDegreeOf(1)).equals(1)
    expect(graph.weightOf(0, 1)).equals(-1)
    expect(graph.weightOf(1, 0)).equals(-1)

    expect(graph.connect(0, 1, 1)).to.be.true
    expect(graph.hasEdge(0, 1)).to.be.true
    expect(graph.hasEdge(0, 1, 1)).to.be.true
    expect(graph.hasEdge(1, 0, 1)).to.be.true
    expect(graph.weightOf(1, 0)).equals(1)
    expect(graph.weightOf(1, 0)).equals(1)

    const edges = graph.edges()
    expect(edges.length).equals(1)
    expect(edges.every(e => e.undirected)).is.true
  })
})
