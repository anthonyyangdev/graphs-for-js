import { GraphType } from '../../types/GraphType'
import { MutableGraph, ReadonlyGraph } from '../../types/GraphSystem'
import { GraphBuilder } from '../../../index'

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
  g: ReadonlyGraph<V, E>,
  callback: (v: V) => N,
  newKeyFunction?: (n: N) => string
) => {
  const edges = g.edges()
  const nodes = g.nodes()

  let clone: MutableGraph<N, E>
  const builder = newKeyFunction != null
    ? GraphBuilder<N, E>().withKeyFunction(newKeyFunction)
    : GraphBuilder<N, E>().withoutKeyFunction()
  switch (g.getGraphType()) {
    case GraphType.WeightedDirected:
    case GraphType.ReadonlyWeightedDirected:
      clone = builder.directed.weighted()
      break
    case GraphType.NonWeightedDirected:
    case GraphType.ReadonlyNonWeightedDirected:
      clone = builder.directed.unweighted()
      break
    case GraphType.WeightedUndirected:
    case GraphType.ReadonlyWeightedUndirected:
      clone = builder.undirected.weighted()
      break
    case GraphType.NonWeightedUndirected:
    case GraphType.ReadonlyNonWeightedUndirected:
      clone = builder.undirected.unweighted()
      break
  }
  clone.insert(...nodes.map(n => callback(n)))
  edges.forEach(({ source, value, target }) => {
    clone.connect(callback(source), callback(target), value)
  })
  return clone
}
