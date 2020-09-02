import { GraphType } from '../types/GraphType'
import { ReadonlyGraph } from '../types/GraphSystem'
import { ReadonlyUnweightedGraph, ReadonlyWeightedGraph } from '../system/ReadonlyGraphs'
import { MutableUnweightedGraph, MutableWeightedGraph } from '../system/MutableGraphs'

type CastedType<V, E> = {
  type: GraphType.WeightedDirected,
  graph: MutableWeightedGraph<V, E>
} | {
  type: GraphType.NonWeightedDirected,
  graph: MutableUnweightedGraph<V, E>
} | {
  type: GraphType.WeightedUndirected,
  graph: MutableWeightedGraph<V, E>
} | {
  type: GraphType.NonWeightedUndirected,
  graph: MutableUnweightedGraph<V, E>
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
 * @param g The graph whose type and implementation is to be checked
 * @deprecated No longer needed by exposed isUndirected and isUnweighted field properties.
 */
export const castExplicitly = <V, E> (g: ReadonlyGraph<V, E>): CastedType<V, E> => {
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
        type, graph: g as MutableWeightedGraph<V, E>
      }
    case GraphType.NonWeightedDirected:
      return {
        type, graph: g as MutableUnweightedGraph<V, E>
      }
    case GraphType.WeightedUndirected:
      return {
        type, graph: g as MutableWeightedGraph<V, E>
      }
    case GraphType.NonWeightedUndirected:
      return {
        type, graph: g as MutableUnweightedGraph<V, E>
      }
  }
}
