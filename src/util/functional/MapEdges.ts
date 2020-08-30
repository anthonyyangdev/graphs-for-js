import { IGeneralNodeGraph, IReadonlyWeightedGraph } from '../../types/GraphInterface'
import { GraphType } from '../../types/GraphType'
import { WeightedDirectedGraph } from '../../mutable/DirectedGraphs'
import { WeightedUndirectedGraph } from '../../mutable/UndirectedGraphs'

export const mapEdges = <V, E, R> (g: IReadonlyWeightedGraph<V, E>, callback: (e: E) => R) => {
  const edges = g.edges()
  const nodes = g.nodes()

  let clone: IGeneralNodeGraph<V, R>
  switch (g.getGraphType()) {
    case GraphType.WeightedDirected:
    case GraphType.ReadonlyWeightedDirected:
    case GraphType.NonWeightedDirected:
    case GraphType.ReadonlyNonWeightedDirected:
      clone = new WeightedDirectedGraph<V, R>(g.toKeyFn)
      break
    case GraphType.WeightedUndirected:
    case GraphType.ReadonlyWeightedUndirected:
    case GraphType.NonWeightedUndirected:
    case GraphType.ReadonlyNonWeightedUndirected:
      clone = new WeightedUndirectedGraph<V, R>(g.toKeyFn)
      break
  }
  clone.insert(...nodes)
  edges.forEach(({ source, value, target }) => {
    const mappedValue = callback(value)
    clone.connect(source, target, mappedValue)
  })
  return clone
}
