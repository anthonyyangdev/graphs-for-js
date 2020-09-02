import { ReadonlyWeightedGraph, MutableWeightedGraph } from '../../types/GraphSystem'
import { createEmptyGraphInstance } from './CreateEmptyGraphInstance'

/**
 * Creates a new graph that maps the edge values in a given graph to new values determined
 * by the given callback function.
 *
 * @param g
 * @param callback
 */
export const mapEdges = <V, E, R> (g: ReadonlyWeightedGraph<V, E>, callback: (e: E) => R) => {
  const edges = g.edges()
  const nodes = g.nodes()

  const clone: MutableWeightedGraph<V, R> = createEmptyGraphInstance(g, g.toKeyFn, true) as MutableWeightedGraph<V, R>
  clone.insert(...nodes)
  edges.forEach(({ source, value, target }) => {
    const mappedValue = callback(value)
    clone.connect(source, target, mappedValue)
  })
  return clone
}
