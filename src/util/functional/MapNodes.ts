import { IGeneralNodeGraph, IReadonlyGeneralNodeGraph } from '../../types/GraphInterface'
import { GraphType } from '../../types/GraphType'
import { DirectedGraph, WeightedDirectedGraph } from '../../mutable/DirectedGraphs'
import { UndirectedGraph, WeightedUndirectedGraph } from '../../mutable/UndirectedGraphs'

/**
 * Creates a new graph that maps the node values of the given graph to new values
 * determined by the callback function. Additionally, a key function for the new
 * graph can be given, otherwise the default key function is used.
 *
 * There are cases when the result of the callback may result in new nodes with the
 * same key value. In such cases, the two nodes are merged as one node in the new graph.
 * Any edges connected to those nodes becomes edges connected to the newly merged node.
 * This also means if those two nodes had an edge with each other, then it becomes self-loop.
 *
 * @param g
 * @param callback
 * @param newKeyFunction
 */
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
