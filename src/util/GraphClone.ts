import { castExplicitly } from './GetExplicitGraph'
import { GraphType } from '../types/GraphType'
import { GraphBuilder } from '../../index'
import { MutableGraph, ReadonlyGraph } from '../types/GraphSystem'

/**
 * Creates a clone of the given graph. The clone is a new graph object instance that
 * has the same, graph type implementation, nodes, and edges as the given graph.
 *
 * @param g
 */
export const clone = <V, E> (g: ReadonlyGraph<V, E>) => {
  /**
   * 1) Get the graph type using casting
   * 2) Instantiate the correct graph
   * 3) Load all nodes and connect all edges, with the correct values.
   */
  let clonedGraph: MutableGraph<V, E>
  const builder = GraphBuilder<V, E>().withKeyFunction(g.toKeyFn)
  const { type } = castExplicitly(g)
  switch (type) {
    case GraphType.WeightedDirected:
    case GraphType.ReadonlyWeightedDirected:
      clonedGraph = builder.directed.weighted(); break
    case GraphType.NonWeightedDirected:
    case GraphType.ReadonlyNonWeightedDirected:
      clonedGraph = builder.directed.unweighted(); break
    case GraphType.WeightedUndirected:
    case GraphType.ReadonlyWeightedUndirected:
      clonedGraph = builder.undirected.weighted(); break
    case GraphType.NonWeightedUndirected:
    case GraphType.ReadonlyNonWeightedUndirected:
      clonedGraph = builder.undirected.unweighted(); break
  }
  const nodes = g.nodes()
  const edges = g.edges()
  clonedGraph.insert(...nodes)
  edges.forEach(({ source, target, value }) => {
    clonedGraph.connect(source, target, value)
  })
  return clonedGraph
}
