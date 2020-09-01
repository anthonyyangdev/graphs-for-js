import { GraphType } from '../../types/GraphType'
import { IMutableWeightedGraph, IReadonlyWeightedGraph } from '../../types/GraphSystem'
import { GraphBuilder } from '../../../index'

/**
 * Creates a new graph that maps the edge values in a given graph to new values determined
 * by the given callback function.
 *
 * @param g
 * @param callback
 */
export const mapEdges = <V, E, R> (g: IReadonlyWeightedGraph<V, E>, callback: (e: E) => R) => {
  const edges = g.edges()
  const nodes = g.nodes()

  let clone: IMutableWeightedGraph<V, R>
  switch (g.getGraphType()) {
    case GraphType.WeightedDirected:
    case GraphType.ReadonlyWeightedDirected:
    case GraphType.NonWeightedDirected:
    case GraphType.ReadonlyNonWeightedDirected:
      clone = GraphBuilder<V, R>().withKeyFunction(g.toKeyFn).directed.weighted()
      break
    case GraphType.WeightedUndirected:
    case GraphType.ReadonlyWeightedUndirected:
    case GraphType.NonWeightedUndirected:
    case GraphType.ReadonlyNonWeightedUndirected:
      clone = GraphBuilder<V, R>().withKeyFunction(g.toKeyFn).undirected.weighted()
      break
  }
  clone.insert(...nodes)
  edges.forEach(({ source, value, target }) => {
    const mappedValue = callback(value)
    clone.connect(source, target, mappedValue)
  })
  return clone
}
