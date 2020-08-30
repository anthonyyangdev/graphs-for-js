import { IGeneralNodeGraph, IReadonlyWeightedGraph } from '../../types/GraphInterface'
import { GraphType } from '../../types/GraphType'
import { WeightedDirectedGraph } from '../../mutable/DirectedGraphs'
import { WeightedUndirectedGraph } from '../../mutable/UndirectedGraphs'

export const mapNodes = <V, E, N> (
  g: IReadonlyWeightedGraph<V, E>,
  callback: (v: V) => N,
  newKeyFunction?: (n: N) => string
) => {
  const edges = g.edges()
  const nodes = g.nodes()

  let clone: IGeneralNodeGraph<N, E>
  switch (g.getGraphType()) {
    case GraphType.WeightedDirected:
    case GraphType.ReadonlyWeightedDirected:
    case GraphType.NonWeightedDirected:
    case GraphType.ReadonlyNonWeightedDirected:
      clone = new WeightedDirectedGraph<N, E>(newKeyFunction)
      break
    case GraphType.WeightedUndirected:
    case GraphType.ReadonlyWeightedUndirected:
    case GraphType.NonWeightedUndirected:
    case GraphType.ReadonlyNonWeightedUndirected:
      clone = new WeightedUndirectedGraph<N, E>(newKeyFunction)
      break
  }
  clone.insert(...nodes.map(n => callback(n)))
  edges.forEach(({ source, value, target }) => {
    clone.connect(callback(source), callback(target), value)
  })
  return clone
}
