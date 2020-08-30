import { WeightedUndirectedGraph } from './src/mutable/WeightedUndirectedGraph'
import { UndirectedGraph } from './src/mutable/UndirectedGraph'
import { WeightedDirectedGraph } from './src/mutable/WeightedDirectedGraph'
import { DirectedGraph } from './src/mutable/DirectedGraph'

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

/**
 * A builder tool for constructing graph data structures. Returns to callback functions,
 * either to build to graph with a key function or without a key function.
 * @constructor
 */
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

/**
 * A utility object which contains graph algorithm implementations and other graph tools,
 * such as cloning and parsing a graph from JSON.
 */
export const GraphUtil = GraphUtility
