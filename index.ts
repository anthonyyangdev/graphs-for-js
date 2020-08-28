import { WeightedUndirectedGraph } from './src/WeightedUndirectedGraph'
import { UndirectedGraph } from './src/UndirectedGraph'
import { DirectedGraph } from './src/DirectedGraph'
import { WeightedDirectedGraph } from './src/WeightedDirectedGraph'

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

export const GraphBuilder = <V, E> () => {
  return {
    withKeyFunction: (fn: (v: V) => string) => builder<V, E>(fn),
    withoutKeyFunction: () => builder<V, E>()
  }
}
