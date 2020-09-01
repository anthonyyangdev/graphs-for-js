import { GraphType } from '../../types/GraphType'
import { Set } from 'typescript-collections'
import { MutableGraph, ReadonlyGraph } from '../../types/GraphSystem'
import { GraphBuilder } from '../../../index'

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
  g: ReadonlyGraph<V, E>,
  nodes: V[]
) => {
  const setOfNodes = new Set<V>(g.toKeyFn)
  nodes.forEach(n => setOfNodes.add(n))

  let clone: MutableGraph<V, E>
  const builder = GraphBuilder<V, E>().withKeyFunction(g.toKeyFn)
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
