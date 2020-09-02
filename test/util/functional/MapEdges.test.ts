import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Graph, GraphUtil } from '../../../index'

describe('Map edges test suite', function () {
  const gen = new Graph<number, string>().noKey()

  it('should create a new map from no edges', function () {
    const graph = gen.undirected.weighted()
    graph.insert(1, 2, 3, 4)

    const mapped = GraphUtil.functional.mapEdges(graph, e => Number.parseInt(e))
    expect(mapped).does.not.equal(graph)
    expect(mapped.nodes().length).equals(mapped.count()).equals(4)
    expect(mapped.edges().length).equals(0)
  })

  it('should create a new graph with mapped edges', function () {
    const graph = gen.undirected.weighted()
    graph.insert(1, 2, 3, 4, 5)
    graph.connect(1, 4, '5')
    graph.connect(1, 5, '6')
    graph.connect(1, 2, '3')
    graph.connect(1, 3, '4')
    const mapped = GraphUtil.functional.mapEdges(graph, e => Number.parseInt(e))

    expect(mapped).does.not.equal(graph)
    expect(mapped.nodes().length).equals(mapped.count()).equals(5)
    expect(mapped.edges().length).equals(4)
    expect(mapped.edges().every(({ source, value, target }) => {
      return source + target === value
    })).is.true
  })
})
