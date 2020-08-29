import { GraphInterface } from '../types/GraphInterface'
import { GraphType } from '../types/GraphType'
import { WeightedDirectedGraph } from '../WeightedDirectedGraph'
import { DirectedGraph } from '../DirectedGraph'
import { WeightedUndirectedGraph } from '../WeightedUndirectedGraph'
import { UndirectedGraph } from '../UndirectedGraph'

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
}

export const castExplicitly = <V, E> (g: GraphInterface<V, E>): CastedType<V, E> => {
  switch (g.getGraphType()) {
    case GraphType.WeightedDirected:
      return {
        type: GraphType.WeightedDirected,
        graph: g as WeightedDirectedGraph<V, E>
      }
    case GraphType.NonWeightedDirected:
      return {
        type: GraphType.NonWeightedDirected,
        graph: g as unknown as DirectedGraph<V, E>
      }
    case GraphType.WeightedUndirected:
      return {
        type: GraphType.WeightedUndirected,
        graph: g as WeightedUndirectedGraph<V, E>
      }
    case GraphType.NonWeightedUndirected:
      return {
        type: GraphType.NonWeightedUndirected,
        graph: g as unknown as UndirectedGraph<V, E>
      }
    default:
      throw new Error('No case found')
  }
}
