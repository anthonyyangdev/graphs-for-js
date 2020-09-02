import * as GraphUtility from './src/GraphUtil'
import { ReadonlyUnweightedGraph, ReadonlyWeightedGraph } from './src/system/ReadonlyGraphs'
import { MutableUnweightedGraph, MutableWeightedGraph } from './src/system/MutableGraphs'

/**
 * @deprecated Please use the generator function
 * @param fn
 */
const builder = <V, E>(fn?: (v: V) => string) => {
  const gen = fn != null
    ? new Graph<V, E>().keyFn(fn)
    : new Graph<V, E>().noKey()
  return {
    readonly: (nodes?: V[]) => {
      return {
        directed: {
          weighted: (edges: [V, V, E][]): ReadonlyWeightedGraph<V, E> => {
            return gen.readonly.directed.weighted(edges, nodes)
          },
          unweighted: (edges: [V, V][]): ReadonlyUnweightedGraph<V, E> => {
            return gen.readonly.directed.unweighted(edges, nodes)
          }
        },
        undirected: {
          weighted: (edges: [V, V, E][]): ReadonlyWeightedGraph<V, E> => {
            return gen.readonly.undirected.weighted(edges, nodes)
          },
          unweighted: (edges: [V, V][]): ReadonlyUnweightedGraph<V, E> => {
            return gen.readonly.undirected.unweighted(edges, nodes)
          }
        }
      }
    },
    directed: {
      weighted: (): MutableWeightedGraph<V, E> => gen.directed.weighted(),
      unweighted: (): MutableUnweightedGraph<V, E> => gen.directed.unweighted()
    },
    undirected: {
      weighted: (): MutableWeightedGraph<V, E> => gen.undirected.weighted(),
      unweighted: (): MutableUnweightedGraph<V, E> => gen.undirected.unweighted()
    }
  }
}

/**
 * A builder tool for constructing graph data structures. Returns to callback functions,
 * either to build to graph with a key function or without a key function.
 *
 * @deprecated Please use the Graphs class
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

type UnweightedGraphInit<V, E> = [V, V]
type WeightedGraphInit<V, E> = [V, V, E]

const generator = <V, E>(fn?: (v: V) => string) => {
  return {
    directed: {
      weighted: (): MutableWeightedGraph<V, E> => new MutableWeightedGraph<V, E>(false, fn),
      unweighted: (): MutableUnweightedGraph<V, E> => new MutableUnweightedGraph<V, E>(false, true, fn)
    },
    undirected: {
      weighted: (): MutableWeightedGraph<V, E> => new MutableWeightedGraph<V, E>(true, fn),
      unweighted: (): MutableUnweightedGraph<V, E> => new MutableUnweightedGraph<V, E>(true, true, fn)
    },
    readonly: {
      directed: {
        weighted: (init: WeightedGraphInit<V, E>[], nodes?: V[]): ReadonlyWeightedGraph<V, E> => {
          return new ReadonlyWeightedGraph<V, E>(nodes ?? [], init, false, fn)
        },
        unweighted: (init: UnweightedGraphInit<V, E>[], nodes?: V[]): ReadonlyUnweightedGraph<V, E> => {
          return new ReadonlyUnweightedGraph<V, E>(nodes ?? [], init, false, true, fn)
        }
      },
      undirected: {
        weighted: (init: WeightedGraphInit<V, E>[], nodes?: V[]): ReadonlyWeightedGraph<V, E> => {
          return new ReadonlyWeightedGraph<V, E>(nodes ?? [], init, true, fn)
        },
        unweighted: (init: UnweightedGraphInit<V, E>[], nodes?: V[]): ReadonlyUnweightedGraph<V, E> => {
          return new ReadonlyUnweightedGraph<V, E>(nodes ?? [], init, true, true, fn)
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
