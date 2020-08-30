import * as GraphUtility from './src/GraphUtil'
import { ReadonlyDirectedGraph, ReadonlyWeightedDirectedGraph } from './src/readonly/ImmutableDirectedGraphs'
import { ReadonlyUndirectedGraph, ReadonlyWeightedUndirectedGraph } from './src/readonly/ImmutableUndirectedGraphs'
import { DirectedGraph, WeightedDirectedGraph } from './src/mutable/DirectedGraphs'
import { UndirectedGraph, WeightedUndirectedGraph } from './src/mutable/UndirectedGraphs'

const builder = <V, E>(fn?: (v: V) => string) => {
  return {
    readonly: (nodes: V[]) => {
      return {
        directed: {
          weighted: (edges: [V, V, E][]): ReadonlyWeightedDirectedGraph<V, E> => {
            return new ReadonlyWeightedDirectedGraph<V, E>(nodes, edges, fn)
          },
          unweighted: (edges: [V, V][]): ReadonlyDirectedGraph<V, E> => {
            return new ReadonlyDirectedGraph<V, E>(nodes, edges, fn)
          }
        },
        undirected: {
          weighted: (edges: [V, V, E][]): ReadonlyWeightedUndirectedGraph<V, E> => {
            return new ReadonlyWeightedUndirectedGraph<V, E>(nodes, edges, fn)
          },
          unweighted: (edges: [V, V][]): ReadonlyUndirectedGraph<V, E> => {
            return new ReadonlyUndirectedGraph<V, E>(nodes, edges, fn)
          }
        }
      }
    },
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

export { GraphType } from './src/types/GraphType'
