import { describe, it } from 'mocha'
import { expect } from 'chai'
import { GraphBuilder, GraphUtil } from '../../index'
import { ReadonlyGraph } from '../../src/types/GraphSystem'

const compare = (a: number, b: number) => a - b

const validateTopologicalSort = <V, E> (ordering: V[] | undefined, g: ReadonlyGraph<V, E>) => {
  expect(ordering).is.not.undefined
  ordering = ordering!
  expect(ordering.length).equals(g.count())
  const edges = g.edges()
  for (const uv of edges) {
    const u = ordering.indexOf(uv.source)
    const v = ordering.indexOf(uv.target)
    expect(u).is.lessThan(v)
  }
}

describe('Topological sort test', function () {
  describe('Non-DAG. Expected to fail', function () {
    it('should fail on any undirected graph with edges', function () {
      const undirected = GraphBuilder<number>()
        .withoutKeyFunction().readonly([1, 2, 3])
        .undirected.unweighted([[1, 2], [2, 3]])
      expect(GraphUtil.topologicalSort(undirected, compare)).is.undefined
    })
    it('should fail on any directed graphs with a cycle', function () {
      const directedCycle = GraphBuilder<number>()
        .withoutKeyFunction().readonly([1, 2, 3])
        .directed.unweighted([[1, 2], [2, 3], [3, 1]])
      expect(GraphUtil.topologicalSort(directedCycle, compare)).is.undefined
    })
  })
  describe('DAGs. Expected to succeed', function () {
    it('should work on a graph with no nodes, yield empty', function () {
      const empty = GraphBuilder<number>()
        .withoutKeyFunction().readonly([])
        .undirected.unweighted([])
      let result = GraphUtil.topologicalSort(empty, compare)
      expect(result).is.not.undefined
      result = result!
      expect(result.length).equals(0)
    })
    it('should work on an undirected graph with one node', function () {
      const singleton = GraphBuilder<number>()
        .withoutKeyFunction().readonly([1])
        .undirected.unweighted([])
      let result = GraphUtil.topologicalSort(singleton, compare)
      expect(result).is.not.undefined
      result = result!
      expect(result.length).equals(1)
      expect(result).deep.equals([1])
    })
    it('should work on simple straight line DAG', function () {
      const line = GraphBuilder<number>()
        .withoutKeyFunction().readonly([1, 2, 3, 4])
        .directed.unweighted([[1, 2], [2, 3], [3, 4]])
      const result = GraphUtil.topologicalSort(line, compare)
      validateTopologicalSort(result, line)
    })
    it('should work on example DAG https://media.geeksforgeeks.org/wp-content/cdn-uploads/graph.png', function () {
      const example = GraphBuilder<number>()
        .withoutKeyFunction().readonly([0, 1, 2, 3, 4, 5])
        .directed.unweighted([[5, 0], [4, 0], [5, 2], [4, 1], [2, 3], [3, 1]])
      const result = GraphUtil.topologicalSort(example, compare)
      validateTopologicalSort(result, example)
    })

    it('should work on example DAG https://he-s3.s3.amazonaws.com/media/uploads/d6be27e.png', function () {
      const example2 = GraphBuilder<number>()
        .withoutKeyFunction().readonly([1, 2, 3, 4, 5])
        .directed.unweighted([[1, 2], [1, 3], [2, 4], [3, 4], [3, 5]])
      const result = GraphUtil.topologicalSort(example2, compare)
      validateTopologicalSort(result, example2)
    })

    it('should work in on a forest of DAG', function () {
      const forest = GraphBuilder<number>()
        .withoutKeyFunction().readonly([1, 2, 3, 4, 5])
        .directed.unweighted([[1, 2], [2, 3], [1, 3], [4, 5]])
      const result = GraphUtil.topologicalSort(forest, compare)
      validateTopologicalSort(result, forest)
    })
  })
})
