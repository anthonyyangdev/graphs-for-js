import { IGeneralNodeGraph, IReadonlyGeneralNodeGraph, IReadonlyWeightedGraph } from '../../types/GraphInterface'
import { GraphType } from '../../types/GraphType'
import { DirectedGraph, WeightedDirectedGraph } from '../../mutable/DirectedGraphs'
import { UndirectedGraph, WeightedUndirectedGraph } from '../../mutable/UndirectedGraphs'

export const mapNodes = <V, E, N> (
  g: IReadonlyGeneralNodeGraph<V, E>,
  callback: (v: V) => N,
  newKeyFunction?: (n: N) => string
) => {
  const edges = g.edges()
  const nodes = g.nodes()

  let clone: IGeneralNodeGraph<N, E>
  switch (g.getGraphType()) {
    case GraphType.WeightedDirected:
    case GraphType.ReadonlyWeightedDirected:
      clone = new WeightedDirectedGraph<N, E>(newKeyFunction)
      break
    case GraphType.NonWeightedDirected:
    case GraphType.ReadonlyNonWeightedDirected:
      clone = new DirectedGraph<N, E>(newKeyFunction)
      break
    case GraphType.WeightedUndirected:
    case GraphType.ReadonlyWeightedUndirected:
      clone = new WeightedUndirectedGraph<N, E>(newKeyFunction)
      break
    case GraphType.NonWeightedUndirected:
    case GraphType.ReadonlyNonWeightedUndirected:
      clone = new UndirectedGraph<N, E>(newKeyFunction)
      break
  }
  clone.insert(...nodes.map(n => callback(n)))
  edges.forEach(({ source, value, target }) => {
    clone.connect(callback(source), callback(target), value)
  })
  return clone
}
