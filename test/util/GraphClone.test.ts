
import { describe, it } from 'mocha'
import { expect } from 'chai'
import { DirectedGraph } from '../../src/mutable/DirectedGraph'
import { GraphUtil } from '../../index'
import { WeightedUndirectedGraph } from '../../src/mutable/WeightedUndirectedGraph'
import { UndirectedGraph } from '../../src/mutable/UndirectedGraph'
import { GraphType } from '../../src/types/GraphType'
import { WeightedDirectedGraph } from '../../src/mutable/WeightedDirectedGraph'

describe('Clones a graph as a completely new object', function () {
  it('should clone a directed graph', function () {
    const graph = new DirectedGraph<number>()
    const clonedGraph = GraphUtil.clone(graph)
    expect(clonedGraph).does.not.equal(graph) // Different object reference
    expect(clonedGraph.count()).equals(graph.count())
    expect(clonedGraph.getGraphType()).equals(graph.getGraphType())
    clonedGraph.insert(1, 2, 3, 4)
    expect(graph.count()).equals(0)
    expect(clonedGraph.count()).equals(4)
    expect(clonedGraph.contains(1, 2, 3, 4)).is.true

    clonedGraph.connect(1, 2)
    clonedGraph.connect(2, 4)
    expect(graph.edges().length).equals(0)
    expect(clonedGraph.edges().length).equals(2)

    const anotherClone = GraphUtil.clone(clonedGraph)
    expect(clonedGraph).does.not.equal(anotherClone) // Different object reference
    expect(anotherClone.nodes()).deep.equals(clonedGraph.nodes())
    expect(anotherClone.edges()).deep.equals(clonedGraph.edges())
  })

  it('should clone a undirected graph and its weights', function () {
    const graph = new WeightedUndirectedGraph<number, string>()
    graph.insert(1, 2, 3, 4)
    graph.connect(1, 2, 'first')
    graph.connect(2, 3, 'second')

    const clone = GraphUtil.clone(graph)
    expect(clone).does.not.equal(graph) // Different object reference
    expect(clone.hasEdge(1, 2, 'first')).is.true
    expect(clone.hasEdge(2, 3, 'second')).is.true
    expect(clone.hasEdge(2, 1, 'first')).is.true
    expect(clone.hasEdge(3, 2, 'second')).is.true
    expect(clone.nodes()).deep.equals(graph.nodes())
    expect(clone.edges()).deep.equals(graph.edges())
  })

  it('should clone undirected graphs', function () {
    const graph = new UndirectedGraph<number>()
    graph.insert(0, 1, 2)
    graph.connect(0, 1)
    graph.connect(1, 2)
    const cloned = GraphUtil.clone(graph)
    expect(cloned.getGraphType()).equals(GraphType.NonWeightedUndirected)
    expect(cloned.nodes()).deep.equals(graph.nodes())
    expect(cloned.edges()).deep.equals(graph.edges())
  })

  it('should clone directed graphs with weights', function () {
    const graph = new WeightedDirectedGraph<number, number>()
    graph.insert(0, 1, 2)
    graph.connect(0, 1, 0.3)
    graph.connect(1, 2, 0.6)
    const cloned = GraphUtil.clone(graph)
    expect(cloned.getGraphType()).equals(GraphType.WeightedDirected)
    expect(cloned.nodes()).deep.equals(graph.nodes())
    expect(cloned.edges()).deep.equals(graph.edges())
  })
})
