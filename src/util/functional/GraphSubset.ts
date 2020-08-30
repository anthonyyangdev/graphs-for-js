import { IGeneralNodeGraph, IReadonlyGeneralNodeGraph } from '../../types/GraphInterface'
import { GraphType } from '../../types/GraphType'
import { DirectedGraph, WeightedDirectedGraph } from '../../mutable/DirectedGraphs'
import { UndirectedGraph, WeightedUndirectedGraph } from '../../mutable/UndirectedGraphs'
import { Set } from 'typescript-collections'

export const subsetNode = <V, E> (
  g: IReadonlyGeneralNodeGraph<V, E>,
  nodes: V[]
) => {
  const setOfNodes = new Set<V>(g.toKeyFn)
  nodes.forEach(n => setOfNodes.add(n))

  let clone: IGeneralNodeGraph<V, E>
  switch (g.getGraphType()) {
    case GraphType.WeightedDirected:
    case GraphType.ReadonlyWeightedDirected:
      clone = new WeightedDirectedGraph<V, E>(g.toKeyFn)
      break
    case GraphType.NonWeightedDirected:
    case GraphType.ReadonlyNonWeightedDirected:
      clone = new DirectedGraph<V, E>(g.toKeyFn)
      break
    case GraphType.WeightedUndirected:
    case GraphType.ReadonlyWeightedUndirected:
      clone = new WeightedUndirectedGraph<V, E>(g.toKeyFn)
      break
    case GraphType.NonWeightedUndirected:
    case GraphType.ReadonlyNonWeightedUndirected:
      clone = new UndirectedGraph<V, E>(g.toKeyFn)
      break
  }
  g.nodes().forEach(n => {
    if (setOfNodes.contains(n)) clone.insert(n)
  })
  g.edges().forEach(({ source, value, target }) => {
    if (clone.contains(source, target)) {
      clone.connect(source, target, value)
    }
  })
  return clone
}
