import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Graph, GraphUtil } from '../../index'
import { ReadonlyUnweightedGraph } from '../../src/types/GraphSystem'

const validateTopologicalSort = <V, E> (ordering: V[] | undefined, g: ReadonlyUnweightedGraph<V, E>) => {
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
  const gen = new Graph<number, number>().noKey()

  describe('Non-DAG. Expected to fail', function () {
    it('should fail on any undirected graph with edges', function () {
      const undirected = gen.readonly
        .undirected.unweighted([[1, 2], [2, 3]], [1, 2, 3])
      expect(GraphUtil.topologicalSort(undirected)).is.undefined
    })
    it('should fail on any directed graphs with a cycle', function () {
      const directedCycle = gen.readonly
        .directed.unweighted([[1, 2], [2, 3], [3, 1]], [1, 2, 3])
      expect(GraphUtil.topologicalSort(directedCycle)).is.undefined
    })
  })
  describe('DAGs. Expected to succeed', function () {
    it('should work on a graph with no nodes, yield empty', function () {
      const empty = gen.readonly.undirected.unweighted([], [])
      let result = GraphUtil.topologicalSort(empty)
      expect(result).is.not.undefined
      result = result!
      expect(result.length).equals(0)
    })
    it('should work on an undirected graph with one node', function () {
      const singleton = gen.readonly.undirected.unweighted([], [1])
      let result = GraphUtil.topologicalSort(singleton)
      expect(result).is.not.undefined
      result = result!
      expect(result.length).equals(1)
      expect(result).deep.equals([1])
    })
    it('should work on simple straight line DAG', function () {
      const line = gen.readonly
        .directed.unweighted([[1, 2], [2, 3], [3, 4]], [1, 2, 3, 4])
      const result = GraphUtil.topologicalSort(line)
      validateTopologicalSort(result, line)
    })
    it('should work on example DAG https://media.geeksforgeeks.org/wp-content/cdn-uploads/graph.png', function () {
      const example = gen.readonly.directed
        .unweighted(
          [[5, 0], [4, 0], [5, 2], [4, 1], [2, 3], [3, 1]],
          [0, 1, 2, 3, 4, 5])
      const result = GraphUtil.topologicalSort(example)
      validateTopologicalSort(result, example)
    })

    it('should work on example DAG https://he-s3.s3.amazonaws.com/media/uploads/d6be27e.png', function () {
      const example2 = gen.readonly.directed
        .unweighted([[1, 2], [1, 3], [2, 4], [3, 4], [3, 5]], [1, 2, 3, 4, 5])
      const result = GraphUtil.topologicalSort(example2)
      validateTopologicalSort(result, example2)
    })

    it('should work in on a forest of DAG', function () {
      const forest = gen.readonly.directed
        .unweighted([[1, 2], [2, 3], [1, 3], [4, 5]], [1, 2, 3, 4, 5])
      const result = GraphUtil.topologicalSort(forest)
      validateTopologicalSort(result, forest)
    })
  })
})
