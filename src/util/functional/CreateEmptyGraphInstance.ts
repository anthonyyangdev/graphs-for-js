import { GraphType } from '../../types/GraphType'
import { MutableGraph, ReadonlyGraph } from '../../types/GraphSystem'
import { GraphBuilder } from '../../../index'

export const createEmptyGraphInstance = <V, E, N, R> (
  g: ReadonlyGraph<V, E>,
  keyFn?: (v: N) => string,
  onlyWeighted: boolean = false
): MutableGraph<N, R> => {
  const builder = keyFn != null
    ? GraphBuilder<N, R>().withKeyFunction(keyFn)
    : GraphBuilder<N, R>().withoutKeyFunction()
  switch (g.getGraphType()) {
    case GraphType.NonWeightedDirected:
    case GraphType.ReadonlyNonWeightedDirected:
      return (onlyWeighted
        ? builder.directed.weighted()
        : builder.directed.unweighted())
    case GraphType.WeightedDirected:
    case GraphType.ReadonlyWeightedDirected:
      return builder.directed.weighted()
    case GraphType.NonWeightedUndirected:
    case GraphType.ReadonlyNonWeightedUndirected:
      return (onlyWeighted
        ? builder.undirected.weighted()
        : builder.undirected.unweighted())
    case GraphType.WeightedUndirected:
    case GraphType.ReadonlyWeightedUndirected:
      return builder.undirected.weighted()
  }
}
