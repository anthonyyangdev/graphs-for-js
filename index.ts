import { WeightedUndirectedGraph } from './src/WeightedUndirectedGraph'
import { UndirectedGraph } from './src/UndirectedGraph'
import { DirectedGraph } from './src/DirectedGraph'
import { WeightedDirectedGraph } from './src/WeightedDirectedGraph'

import * as GraphUtility from './src/GraphUtil'

const builder = <V, E>(fn?: (v: V) => string) => {
  return {
    directed: {
      weighted: () => new WeightedDirectedGraph<V, E>(fn),
      unweighted: () => new DirectedGraph<V>(fn)
    },
    undirected: {
      weighted: () => new WeightedUndirectedGraph<V, E>(fn),
      unweighted: () => new UndirectedGraph<V>(fn)
    }
  }
}

export const GraphBuilder = <V=never, E=never> () => {
  return {
    withKeyFunction (fn: (v: V) => string) {
      return builder<V, E>(fn)
    },
    withoutKeyFunction () {
      return builder<V, E>()
    }
  }
}

export const GraphUtil = GraphUtility
