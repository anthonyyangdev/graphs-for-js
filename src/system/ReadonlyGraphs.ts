import { ReadonlyWeightedGraph, ReadonlyUnweightedGraph, ValueEdge } from '../types/GraphSystem'
import { GraphType } from '../types/GraphType'
import { AbstractGraph } from './AbstractGraph'

/**
 * @deprecated Use the makeReadonly function.
 */
export class ReadonlyUnweightedGraphImpl<V, E=null>
  extends AbstractGraph<V, E>
  implements ReadonlyUnweightedGraph<V, E> {
  constructor (
    nodes: V[],
    edges: ([V, V] | [V, V, E])[],
    isUndirected: boolean,
    isUnweighted: boolean,
    keyFn?: (v: V) => string
  ) {
    super(nodes, edges, isUndirected, isUnweighted, keyFn)
  }

  getGraphType (): GraphType {
    if (this.isUnweighted && this.isUndirected) {
      return GraphType.ReadonlyNonWeightedUndirected
    } else if (this.isUndirected) {
      return GraphType.ReadonlyWeightedUndirected
    } else if (this.isUnweighted) {
      return GraphType.ReadonlyNonWeightedDirected
    } else {
      return GraphType.ReadonlyWeightedDirected
    }
  }
}

/**
 * @deprecated Use the makeReadonly function.
 */
export class ReadonlyWeightedGraphImpl<V, E>
  extends ReadonlyUnweightedGraphImpl<V, E>
  implements ReadonlyWeightedGraph<V, E> {
  constructor (
    nodes: V[],
    edges: [V, V, E][],
    isUndirected: boolean,
    keyFn?: (v: V) => string
  ) {
    super(nodes, edges, isUndirected, false, keyFn)
  }

  weightOf (source: V, target: V): E | undefined {
    const value = this.sourceToTarget.getValue(source).getValue(target)
    return value !== null ? value : undefined
  }

  edges (): ValueEdge<V, E>[] {
    return super.edges().map(e => {
      return { ...e, value: e.value as E }
    })
  }

  incomingEdgesOf (target: V): ValueEdge<V, E>[] {
    return super.incomingEdgesOf(target).map(e => {
      return { ...e, value: e.value as E }
    })
  }

  outgoingEdgesOf (source: V): ValueEdge<V, E>[] {
    return super.outgoingEdgesOf(source).map(e => {
      return { ...e, value: e.value as E }
    })
  }

  hasEdge (source: V, target: V, value?: E): boolean {
    return super.hasEdge(source, target, value)
  }

  getEdgeValue (source: V, target: V): E | undefined {
    return this.weightOf(source, target)
  }
}
