import {
  MutableUnweightedGraph,
  MutableWeightedGraph,
  ReadonlyGraph,
  ReadonlyUnweightedGraph
} from '../../types/GraphSystem'
import { Graph } from '../../../index'

export const createEmptyGraphInstance = <V, E, N, R> (
  g: ReadonlyGraph<V, E>,
  keyFn?: (v: N) => string,
  onlyWeighted: boolean = false
): MutableUnweightedGraph<N, R> | MutableWeightedGraph<V, E> => {
  const builder = keyFn != null
    ? new Graph<N, R>().keyFn(keyFn)
    : new Graph<N, R>().noKey()
  if (g.isUnweighted) {
    if (g.isUndirected) {
      return (onlyWeighted
        ? builder.undirected.weighted()
        : builder.undirected.unweighted())
    } else {
      return (onlyWeighted
        ? builder.directed.weighted()
        : builder.directed.unweighted())
    }
  } else {
    return (g.isUndirected
      ? builder.undirected.weighted()
      : builder.directed.weighted())
  }
}
