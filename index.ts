import * as GraphUtility from './src/GraphUtil'
import { ReadonlyWeightedGraph, ReadonlyUnweightedGraph } from './src/system/ReadonlyGraphs'
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
 *
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

type UnweightedGraphInit<V> = [V, V]
type WeightedGraphInit<V, E> = [V, V, E]

const createWeightedGraph = <V, E> (
  isUndirected: boolean,
  fn: ((v: V) => string) | undefined,
  init?: WeightedGraphInit<V, E>[]
) => {
  const graph = new MutableWeightedGraph<V, E>(true, fn)
  init?.forEach(e => graph.insert(e[0], e[1]))
  init?.forEach(e => graph.connect(e[0], e[1], e[2]))
  return graph
}

const createUnweightedGraph = <V> (
  isUndirected: boolean,
  fn: ((v: V) => string) | undefined,
  init?: UnweightedGraphInit<V>[]) => {
  const graph = new MutableUnweightedGraph<V>(true, true, fn)
  init?.forEach(e => graph.insert(e[0], e[1]))
  init?.forEach(e => graph.connect(e[0], e[1]))
  return graph
}

const generator = <V, E>(fn?: (v: V) => string) => {
  return {
    directed: {
      weighted: (): MutableWeightedGraph<V, E> => new MutableWeightedGraph<V, E>(false, fn),
      unweighted: (): MutableUnweightedGraph<V> => new MutableUnweightedGraph<V>(false, true, fn)
    },
    undirected: {
      weighted: (): MutableWeightedGraph<V, E> => new MutableWeightedGraph<V, E>(true, fn),
      unweighted: (): MutableUnweightedGraph<V> => new MutableUnweightedGraph<V>(true, true, fn)
    },
    readonly: {
      directed: {
        weighted: (init: WeightedGraphInit<V, E>[]): ReadonlyWeightedGraph<V, E> => {
          return createWeightedGraph(false, fn, init)
        },
        unweighted: (init: UnweightedGraphInit<V>[]): ReadonlyUnweightedGraph<V> => {
          return createUnweightedGraph(false, fn, init)
        }
      },
      undirected: {
        weighted: (init: WeightedGraphInit<V, E>[]): ReadonlyWeightedGraph<V, E> => {
          return createWeightedGraph(true, fn, init)
        },
        unweighted: (init: UnweightedGraphInit<V>[]): ReadonlyUnweightedGraph<V> => {
          return createUnweightedGraph(true, fn, init)
        }
      }
    }
  }
}

export class Graph<V, E=never> {
  keyFn (fn: (v: V) => string) {
    return generator<V, E>(fn)
  }

  noKey () {
    return generator<V, E>()
  }
}

/**
 * A utility object which contains graph algorithm implementations and other graph tools,
 * such as cloning and parsing a graph from JSON.
 */
export const GraphUtil = GraphUtility

export { GraphType } from './src/types/GraphType'
