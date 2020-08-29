import { WeightedUndirectedGraph } from './src/WeightedUndirectedGraph'
import { UndirectedGraph } from './src/UndirectedGraph'
import { WeightedDirectedGraph } from './src/WeightedDirectedGraph'
import { DirectedGraph } from './src/DirectedGraph'

import * as GraphUtility from './src/GraphUtil'

const builder = <V, E>(fn?: (v: V) => string) => {
  return {
    directed: {
      weighted: (): WeightedDirectedGraph<V, E> => new WeightedDirectedGraph<V, E>(fn),
      unweighted: (): DirectedGraph<V, E> => new DirectedGraph<V, E>(fn)
    },
    undirected: {
      weighted: (): WeightedUndirectedGraph<V, E> => new WeightedUndirectedGraph<V, E>(fn),
      unweighted: (): UndirectedGraph<V, E> => new UndirectedGraph<V, E>(fn)
    }
  }
}

export const GraphBuilder = <V, E=unknown>() => {
  return {
    withKeyFunction: (fn: (v: V) => string) => {
      return builder<V, E>(fn)
    },
    withoutKeyFunction: () => {
      return builder<V, E>()
    }
  }
}

export const GraphUtil = GraphUtility
