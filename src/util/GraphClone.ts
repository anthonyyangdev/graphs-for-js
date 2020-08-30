import { IGeneralNodeGraph, IReadonlyGeneralNodeGraph } from '../types/GraphInterface'
import { castExplicitly } from './GetExplicitGraph'
import { GraphType } from '../types/GraphType'
import { DirectedGraph, WeightedDirectedGraph } from '../mutable/DirectedGraphs'
import { UndirectedGraph, WeightedUndirectedGraph } from '../mutable/UndirectedGraphs'

/**
 * Creates a clone of the given graph. The clone is a new graph object instance that
 * has the same, graph type implementation, nodes, and edges as the given graph.
 *
 * @param g
 */
export const clone = <V, E> (g: IReadonlyGeneralNodeGraph<V, E>) => {
  /**
   * 1) Get the graph type using casting
   * 2) Instantiate the correct graph
   * 3) Load all nodes and connect all edges, with the correct values.
   */
  let clonedGraph: IGeneralNodeGraph<V, E>
  const { type } = castExplicitly(g)
  switch (type) {
    case GraphType.WeightedDirected:
    case GraphType.ReadonlyWeightedDirected:
      clonedGraph = new WeightedDirectedGraph<V, E>(g.toKeyFn); break
    case GraphType.NonWeightedDirected:
    case GraphType.ReadonlyNonWeightedDirected:
      clonedGraph = new DirectedGraph<V, E>(g.toKeyFn); break
    case GraphType.WeightedUndirected:
    case GraphType.ReadonlyWeightedUndirected:
      clonedGraph = new WeightedUndirectedGraph<V, E>(g.toKeyFn); break
    case GraphType.NonWeightedUndirected:
    case GraphType.ReadonlyNonWeightedUndirected:
      clonedGraph = new UndirectedGraph<V, E>(g.toKeyFn); break
  }
  const nodes = g.nodes()
  const edges = g.edges()
  clonedGraph.insert(...nodes)
  edges.forEach(({ source, target, value }) => {
    clonedGraph.connect(source, target, value)
  })
  return clonedGraph
}
