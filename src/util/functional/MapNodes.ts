import { MutableUnweightedGraph, ReadonlyUnweightedGraph } from '../../types/GraphSystem'
import { createEmptyGraphInstance } from './CreateEmptyGraphInstance'

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
  g: ReadonlyUnweightedGraph<V, E>,
  callback: (v: V) => N,
  newKeyFunction?: (n: N) => string
) => {
  const edges = g.edges()
  const nodes = g.nodes()
  const clone: MutableUnweightedGraph<N, E> = createEmptyGraphInstance(g, newKeyFunction) as MutableUnweightedGraph<N, E>
  clone.insert(...nodes.map(n => callback(n)))
  edges.forEach(({ source, value, target }) => {
    clone.connect(callback(source), callback(target), value)
  })
  return clone
}
