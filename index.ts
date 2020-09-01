import * as GraphUtility from './src/GraphUtil'
import { ReadonlyWeightedGraph, ReadonlyUnweightedGraph } from './src/system/ReadonlyGraphS'
import { MutableUnweightedGraph, MutableWeightedGraph } from './src/system/MutableGraphs'

const builder = <V, E>(fn?: (v: V) => string) => {
  return {
    readonly: (nodes: V[]) => {
      return {
        directed: {
          weighted: (edges: [V, V, E][]): ReadonlyWeightedGraph<V, E> => {
            return new ReadonlyWeightedGraph<V, E>(nodes, edges, false, fn)
          },
          unweighted: (edges: [V, V][]): ReadonlyUnweightedGraph<V, E> => {
            return new ReadonlyUnweightedGraph<V, E>(nodes, edges, false, true, fn)
          }
        },
        undirected: {
          weighted: (edges: [V, V, E][]): ReadonlyWeightedGraph<V, E> => {
            return new ReadonlyWeightedGraph<V, E>(nodes, edges, true, fn)
          },
          unweighted: (edges: [V, V][]): ReadonlyUnweightedGraph<V, E> => {
            return new ReadonlyUnweightedGraph<V, E>(nodes, edges, true, true, fn)
          }
        }
      }
    },
    directed: {
      weighted: (): MutableWeightedGraph<V, E> => new MutableWeightedGraph<V, E>(false, fn),
      unweighted: (): MutableUnweightedGraph<V, E> => new MutableUnweightedGraph<V, E>(false, true, fn)
    },
    undirected: {
      weighted: (): MutableWeightedGraph<V, E> => new MutableWeightedGraph<V, E>(true, fn),
      unweighted: (): MutableUnweightedGraph<V, E> => new MutableUnweightedGraph<V, E>(true, true, fn)
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

export { GraphType } from './src/types/GraphType'
