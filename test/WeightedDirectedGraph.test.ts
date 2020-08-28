import { describe, it } from 'mocha'
import { expect } from 'chai'
import { WeightedDirectedGraph } from '../src/WeightedDirectedGraph'

describe('Weighted directed graph', function () {
  it('should instantiate', function () {
    const graph = new WeightedDirectedGraph<number, number>()
    expect(graph.edges().length).equals(0)
    expect(graph.nodes().length).equals(0)
  })
})
