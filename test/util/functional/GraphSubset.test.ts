import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Graph, GraphUtil } from '../../../index'

describe('Graph Subset Test Suite', function () {
  const gen = new Graph<number, number>().noKey()

  it('should create a subset using a conditional statement', function () {
    const g = gen.undirected.weighted()
    g.insert(1, 2, 3, 4, 5, 6)
    // Even is connected to an odd
    g.connect(1, 2, 0.6)
    g.connect(3, 4, 1)
    g.connect(5, 6, 1)

    // Takes only the even nodes
    const subset = GraphUtil.functional.subset(g, v => v % 2 === 0)
    expect(subset.count()).equals(3)
    expect(subset.nodes().every(n => n % 2 === 0)).is.true
    expect(subset.edges().length).equals(0)
    expect(subset.contains(2, 4, 6)).is.true
  })
  it('should create a subset of a given graph', function () {
    const g = gen.directed.weighted()
    g.insert(1, 2, 3, 4)
    g.connect(1, 2, 5)
    g.connect(2, 3, 0.75)
    g.connect(3, 4, 0.8)

    const emptySubset = GraphUtil.functional.subset(g, [])
    expect(emptySubset.nodes().length).equals(emptySubset.count()).equals(0)
    expect(emptySubset.contains(1)).is.false
    expect(emptySubset.edges().length).equals(0)

    const hasOnlyOne = GraphUtil.functional.subset(g, [1])
    expect(hasOnlyOne.nodes().length).equals(hasOnlyOne.count()).equals(1)
    expect(hasOnlyOne.contains(1)).is.true
    expect(hasOnlyOne.edges().length).equals(0)

    const hasOneAndTwo = GraphUtil.functional.subset(g, [1, 2])
    expect(hasOneAndTwo.nodes().length).equals(hasOneAndTwo.count()).equals(2)
    expect(hasOneAndTwo.contains(1, 2)).is.true
    expect(hasOneAndTwo.edges().length).equals(1)
    expect(hasOneAndTwo.hasEdge(1, 2, 5)).is.true

    const disjoint = GraphUtil.functional.subset(g, [1, 4])
    expect(disjoint.nodes().length).equals(disjoint.count()).equals(2)
    expect(disjoint.contains(1, 4)).is.true
    expect(disjoint.edges().length).equals(0)
  })
})
