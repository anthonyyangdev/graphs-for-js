import { WeightedUndirectedGraph } from './src/WeightedUndirectedGraph'
import { UndirectedGraph } from './src/UndirectedGraph'
import { WeightedDirectedGraph } from './src/WeightedDirectedGraph'
import { DirectedGraph } from './src/DirectedGraph'

import * as GraphUtility from './src/GraphUtil'

export const builder = <V, E>(fn?: (v: V) => string) => {
  return {
    directed: {
      weighted: (): WeightedDirectedGraph<V, E> => new WeightedDirectedGraph<V, E>(fn),
      unweighted: (): DirectedGraph<V> => new DirectedGraph<V>(fn)
    },
    undirected: {
      weighted: (): WeightedUndirectedGraph<V, E> => new WeightedUndirectedGraph<V, E>(fn),
      unweighted: (): UndirectedGraph<V> => new UndirectedGraph<V>(fn)
    }
  }
}

export const GraphBuilder = <V=unknown, E=unknown>() => {
  return {
    withKeyFunction: <V, E> (fn: (v: V) => string) => {
      return builder<V, E>(fn)
    },
    withoutKeyFunction: <V> () => {
      return builder<V, E>()
    }
  }
}

export const GraphUtil = GraphUtility
