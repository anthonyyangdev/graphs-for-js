import { Set } from 'typescript-collections'
import { MutableUnweightedGraph, ReadonlyUnweightedGraph } from '../../types/GraphSystem'
import { createEmptyGraphInstance } from './CreateEmptyGraphInstance'

/**
 * Creates a new graph that is a subset of the given graph.
 *
 * The new graph contains all of the given nodes from the previous graph if they exist.
 *
 * For every edge in the given graph, if the source and target nodes of that edge is
 * contained in the new graph, then that edge and its weight is added to the new graph.
 *
 * @param g
 * @param nodes
 */
export const subsetNode = <V, E> (
  g: ReadonlyUnweightedGraph<V, E>,
  nodes: V[] | ((v: V) => boolean)
) => {
  const setOfNodes = new Set<V>(g.toKeyFn)
  if (nodes instanceof Array) { nodes.forEach(n => setOfNodes.add(n)) }

  const clone: MutableUnweightedGraph<V, E> = createEmptyGraphInstance(g, g.toKeyFn)
  g.nodes().forEach(n => {
    if (nodes instanceof Array) {
      if (setOfNodes.contains(n)) clone.insert(n)
    } else if (nodes(n)) {
      clone.insert(n)
    }
  })
  g.edges().forEach(({ source, value, target }) => {
    if (clone.contains(source, target)) {
      clone.connect(source, target, value)
    }
  })
  return clone
}
