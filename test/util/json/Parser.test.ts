import { describe, it } from 'mocha'
import { parse } from '../../../src/util/json'
import { expect } from 'chai'
import { GraphType } from '../../../src/types/GraphType'
import { WeightedUndirectedGraph } from '../../../src/WeightedUndirectedGraph'

describe('Parse graphs from json', function () {
  it('should parse undirected and weighted graph json', function () {
    const json = `{
      "undirected": true,
      "weighted": true,
      "nodes": [1,2],
      "edges": [{
        "source": 1,
        "target": 2,
        "value": "hello"
      }]
    }`
    const graph = parse<number, string>(json)
    expect(graph.getGraphType()).equals(GraphType.WeightedUndirected)
    expect(graph.nodes().length).equals(graph.count()).equals(2)
    expect(graph.contains(1, 2)).is.true
    expect(graph.hasEdge(1, 2)).is.true
    const weightedUndirectedGraph: WeightedUndirectedGraph<number, string> =
      graph as WeightedUndirectedGraph<number, string>
    expect(weightedUndirectedGraph.degreeOf(1)).equals(1)
    expect(weightedUndirectedGraph.getEdgeValue(1, 2)).equals('hello')
  })
  it('should parse undirected and unweighted graph json', function () {
    const json = `{
      "undirected": true,
      "weighted": false,
      "nodes": [1, 2, 3, 4],
      "edges": [{
        "source": 1,
        "target": 2
      }, {
        "source": 2,
        "target": 3
      }, {
        "source": 3,
        "target": 4
      }]
    }`
    const graph = parse<number>(json)
    expect(graph.getGraphType()).equals(GraphType.NonWeightedUndirected)
    expect(graph.count()).equals(graph.nodes().length).equals(4)
    expect(graph.edges().length).equals(3)
    expect(graph.contains(1, 2, 3, 4)).is.true
    expect(graph.hasEdge(1, 2)).is.true
    expect(graph.hasEdge(2, 1)).is.true
    expect(graph.hasEdge(2, 3)).is.true
    expect(graph.hasEdge(3, 2)).is.true
    expect(graph.hasEdge(3, 4)).is.true
    expect(graph.hasEdge(4, 3)).is.true
  })
})
