import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Graph, GraphUtil } from '../../../index'

describe('Map nodes test suite', function () {
  const gen = new Graph<number | string, number>().noKey()

  it('should map empty map', function () {
    const graph = gen.undirected.unweighted()
    const mapped = GraphUtil.functional.mapNodes(graph, n => n)
    expect(mapped).does.not.equal(graph)
    expect(mapped.nodes().length).equals(mapped.count()).equals(0)
    expect(mapped.edges().length).equals(0)
  })

  it('should map the node values while preserving edges', function () {
    const graph = gen.directed.weighted()
    graph.insert('hello', 'world', 'how', 'are', 'you')
    graph.connect('hello', 'world', 0)
    graph.connect('world', 'how', 1)

    const mapped = GraphUtil.functional.mapNodes(graph, n => n + '_mapped')
    expect(mapped.contains(
      'hello_mapped', 'world_mapped', 'how_mapped', 'are_mapped', 'you_mapped')
    ).is.true
    expect(mapped.count()).equals(mapped.nodes().length).equals(5)
    expect(mapped.edges().length).equals(2)
    expect(mapped.hasEdge('hello_mapped', 'world_mapped', 0)).is.true
    expect(mapped.hasEdge('world_mapped', 'how_mapped', 1)).is.true
  })

  it('should set all edges to newly mapped node b/c of key function', function () {
    const graph = gen.directed.weighted()
    graph.insert('hello', 'world', 'how', 'are', 'you')
    graph.connect('hello', 'world', 0)
    graph.connect('world', 'how', 1)

    const mapped = GraphUtil.functional.mapNodes(graph, n => n, n => '0')
    expect(mapped.count()).equals(mapped.nodes().length).equals(1)
    expect(mapped.edges().length).equals(1)
    expect(mapped.contains('hello')).is.true
    expect(mapped.hasEdge('hello', 'hello', 1)).is.true
  })
})
