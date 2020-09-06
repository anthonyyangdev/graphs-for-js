import * as GraphUtility from './src/GraphUtil'
import { UnweightedGraph, WeightedGraph } from './src/system/MutableGraphs'
import {
  MutableWeightedGraph,
  ReadonlyWeightedGraph,
  MutableUnweightedGraph,
  ReadonlyUnweightedGraph
} from './src/types/GraphSystem'

type UnweightedGraphInit<V, E> = [V, V]
type WeightedGraphInit<V, E> = [V, V, E]

const generator = <V, E>(fn?: (v: V) => string) => {
  return {
    /**
     * Creates a directed graph.
     */
    directed: {
      /**
       * Creates a weighted, directed graph.
       */
      weighted: (): MutableWeightedGraph<V, E> => new WeightedGraph<V, E>(false, fn),
      /**
       * Creates an unweighted, directed graph.
       */
      unweighted: (): MutableUnweightedGraph<V, E> => new UnweightedGraph<V, E>(false, true, fn)
    },
    /**
     * Creates an undirected graph.
     */
    undirected: {
      /**
       * Creates a weighted, undirected graph.
       */
      weighted: (): MutableWeightedGraph<V, E> => new WeightedGraph<V, E>(true, fn),
      /**
       * Creates an unweighted, undirected graph.
       */
      unweighted: (): MutableUnweightedGraph<V, E> => new UnweightedGraph<V, E>(true, true, fn)
    },
    /**
     * Creates a readonly graph that cannot be modified after the given inputs.
     */
    readonly: {
      /**
       * Creates an directed, readonly graph.
       */
      directed: {
        /**
         * Creates a weighted, directed, readonly graph.
         */
        weighted: (init: WeightedGraphInit<V, E>[], nodes?: V[]): ReadonlyWeightedGraph<V, E> => {
          const g = new WeightedGraph<V, E>(false, fn)
          nodes?.forEach(n => g.insert(n))
          init?.forEach(e => g.connect(e[0], e[1], e[2]))
          return g.makeReadonly()
        },
        /**
         * Creates an unweighted, directed, readonly graph.
         */
        unweighted: (init: UnweightedGraphInit<V, E>[], nodes?: V[]): ReadonlyUnweightedGraph<V, E> => {
          const g = new UnweightedGraph<V, E>(false, true, fn)
          nodes?.forEach(n => g.insert(n))
          init?.forEach(e => g.connect(e[0], e[1]))
          return g.makeReadonly()
        }
      },
      /**
       * Creates an undirected, readonly graph.
       */
      undirected: {
        /**
         * Creates a weighted, undirected, readonly graph.
         */
        weighted: (init: WeightedGraphInit<V, E>[], nodes?: V[]): ReadonlyWeightedGraph<V, E> => {
          const g = new WeightedGraph<V, E>(true, fn)
          nodes?.forEach(n => g.insert(n))
          init?.forEach(e => g.connect(e[0], e[1], e[2]))
          return g.makeReadonly()
        },
        /**
         * Creates an unweighted, undirected, readonly graph.
         */
        unweighted: (init: UnweightedGraphInit<V, E>[], nodes?: V[]): ReadonlyUnweightedGraph<V, E> => {
          const g = new UnweightedGraph<V, E>(true, true, fn)
          nodes?.forEach(n => g.insert(n))
          init?.forEach(e => g.connect(e[0], e[1]))
          return g.makeReadonly()
        }
      }
    }
  }
}

export class Graph<V, E=never> {
  /**
   * Creates a Graph with the provided key function.
   * @param fn
   */
  keyFn (fn: (v: V) => string) {
    return generator<V, E>(fn)
  }

  /**
   * Creates a Graph using the default key function.
   */
  noKey () {
    return generator<V, E>()
  }
}

/**
 * A utility object which contains graph algorithm implementations and other graph tools,
 * such as cloning and parsing a graph from JSON.
 */
export const GraphUtil = GraphUtility

export {
  MutableWeightedGraph,
  ReadonlyGraph,
  MutableUnweightedGraph,
  MutableGraph,
  ValueEdge,
  BasicEdge,
  ReadonlyWeightedGraph,
  ReadonlyUnweightedGraph
} from './src/types/GraphSystem'
