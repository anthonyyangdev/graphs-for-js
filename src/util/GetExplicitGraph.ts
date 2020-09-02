import { GraphType } from '../types/GraphType'
import { ReadonlyUnweightedGraph } from '../types/GraphSystem'
import { ReadonlyUnweightedGraph, ReadonlyWeightedGraph } from '../system/ReadonlyGraphs'
import { UnweightedGraph, WeightedGraph } from '../system/MutableGraphs'

type CastedType<V, E> = {
  type: GraphType.WeightedDirected,
  graph: WeightedGraph<V, E>
} | {
  type: GraphType.NonWeightedDirected,
  graph: UnweightedGraph<V, E>
} | {
  type: GraphType.WeightedUndirected,
  graph: WeightedGraph<V, E>
} | {
  type: GraphType.NonWeightedUndirected,
  graph: UnweightedGraph<V, E>
} | {
  type: GraphType.ReadonlyWeightedUndirected
  graph: ReadonlyWeightedGraph<V, E>
} | {
  type: GraphType.ReadonlyWeightedDirected
  graph: ReadonlyWeightedGraph<V, E>
} | {
  type: GraphType.ReadonlyNonWeightedDirected
  graph: ReadonlyUnweightedGraph<V, E>
} | {
  type: GraphType.ReadonlyNonWeightedUndirected
  graph: ReadonlyUnweightedGraph<V, E>
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
 * @deprecated No longer needed by exposed isUndirected and isUnweighted field properties.
 * @param g The graph whose type and implementation is to be checked
 */
export const castExplicitly = <V, E> (g: ReadonlyUnweightedGraph<V, E>): CastedType<V, E> => {
  const type = g.getGraphType()
  switch (type) {
    case GraphType.ReadonlyWeightedDirected:
      return {
        type, graph: g as ReadonlyWeightedGraph<V, E>
      }
    case GraphType.ReadonlyNonWeightedDirected:
      return {
        type, graph: g as ReadonlyUnweightedGraph<V, E>
      }
    case GraphType.ReadonlyWeightedUndirected:
      return {
        type, graph: g as ReadonlyWeightedGraph<V, E>
      }
    case GraphType.ReadonlyNonWeightedUndirected:
      return {
        type, graph: g as ReadonlyUnweightedGraph<V, E>
      }
    case GraphType.WeightedDirected:
      return {
        type, graph: g as WeightedGraph<V, E>
      }
    case GraphType.NonWeightedDirected:
      return {
        type, graph: g as UnweightedGraph<V, E>
      }
    case GraphType.WeightedUndirected:
      return {
        type, graph: g as WeightedGraph<V, E>
      }
    case GraphType.NonWeightedUndirected:
      return {
        type, graph: g as UnweightedGraph<V, E>
      }
  }
}
