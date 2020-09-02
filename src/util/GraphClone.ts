import { Graph } from '../../index'
import { MutableUnweightedGraph, ReadonlyUnweightedGraph } from '../types/GraphSystem'

/**
 * Creates a clone of the given graph. The clone is a new graph object instance that
 * has the same, graph type implementation, nodes, and edges as the given graph.
 *
 * @param g
 */
export const clone = <V, E> (g: ReadonlyUnweightedGraph<V, E>) => {
  /**
   * 1) Get the graph type using casting
   * 2) Instantiate the correct graph
   * 3) Load all nodes and connect all edges, with the correct values.
   */
  let clonedGraph: MutableUnweightedGraph<V, E>
  const builder = new Graph<V, E>().keyFn(g.toKeyFn)
  if (g.isUndirected && g.isUnweighted) {
    clonedGraph = builder.undirected.unweighted()
  } else if (g.isUndirected) {
    clonedGraph = builder.undirected.weighted()
  } else if (g.isUnweighted) {
    clonedGraph = builder.directed.unweighted()
  } else {
    clonedGraph = builder.directed.weighted()
  }
  const nodes = g.nodes()
  const edges = g.edges()
  clonedGraph.insert(...nodes)
  edges.forEach(({ source, target, value }) => {
    clonedGraph.connect(source, target, value)
  })
  return clonedGraph
}
