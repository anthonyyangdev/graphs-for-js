import { IReadonlyGeneralNodeGraph } from '../types/GraphInterface'
import { GraphType } from '../types/GraphType'
import { DirectedGraph, WeightedDirectedGraph } from '../mutable/DirectedGraphs'
import { UndirectedGraph, WeightedUndirectedGraph } from '../mutable/UndirectedGraphs'
import { ReadonlyUndirectedGraph, ReadonlyWeightedUndirectedGraph } from '../readonly/ImmutableUndirectedGraphs'
import { ReadonlyDirectedGraph, ReadonlyWeightedDirectedGraph } from '../readonly/ImmutableDirectedGraphs'

type CastedType<V, E> = {
  type: GraphType.WeightedDirected,
  graph: WeightedDirectedGraph<V, E>
} | {
  type: GraphType.NonWeightedDirected,
  graph: DirectedGraph<V, E>
} | {
  type: GraphType.WeightedUndirected,
  graph: WeightedUndirectedGraph<V, E>
} | {
  type: GraphType.NonWeightedUndirected,
  graph: UndirectedGraph<V, E>
} | {
  type: GraphType.ReadonlyWeightedUndirected
  graph: ReadonlyWeightedUndirectedGraph<V, E>
} | {
  type: GraphType.ReadonlyWeightedDirected
  graph: ReadonlyWeightedDirectedGraph<V, E>
} | {
  type: GraphType.ReadonlyNonWeightedDirected
  graph: ReadonlyDirectedGraph<V, E>
} | {
  type: GraphType.ReadonlyNonWeightedUndirected
  graph: ReadonlyUndirectedGraph<V, E>
}

/**
 * Returns an object where the `type` property identifies the type of graph.
 *
 * The `graph` property is the same given graph, but casted to the type identified by
 * the `type` property.
 *
 * This function can be used to safely cast a GraphInterface graph and when you are
 * unsure what implementation is used.
 *
 * @param g The graph whose type and implementation is to be checked
 */
export const castExplicitly = <V, E> (g: IReadonlyGeneralNodeGraph<V, E>): CastedType<V, E> => {
  const type = g.getGraphType()
  switch (type) {
    case GraphType.ReadonlyWeightedDirected:
      return {
        type, graph: g as unknown as ReadonlyWeightedDirectedGraph<V, E>
      }
    case GraphType.ReadonlyNonWeightedDirected:
      return {
        type, graph: g as unknown as ReadonlyWeightedDirectedGraph<V, E>
      }
    case GraphType.ReadonlyWeightedUndirected:
      return {
        type, graph: g as unknown as ReadonlyWeightedUndirectedGraph<V, E>
      }
    case GraphType.ReadonlyNonWeightedUndirected:
      return {
        type, graph: g as unknown as ReadonlyUndirectedGraph<V, E>
      }
    case GraphType.WeightedDirected:
      return {
        type, graph: g as WeightedDirectedGraph<V, E>
      }
    case GraphType.NonWeightedDirected:
      return {
        type, graph: g as unknown as DirectedGraph<V, E>
      }
    case GraphType.WeightedUndirected:
      return {
        type, graph: g as WeightedUndirectedGraph<V, E>
      }
    case GraphType.NonWeightedUndirected:
      return {
        type, graph: g as unknown as UndirectedGraph<V, E>
      }
  }
}
