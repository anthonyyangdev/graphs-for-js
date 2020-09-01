import { IReadonlyWeightedGraph, ReadonlyGraph, ValueEdge } from '../types/GraphSystem'
import { GraphType } from '../types/GraphType'
import { AbstractGraph } from './AbstractGraph'

export class ReadonlyUnweightedGraph<V, E=null>
  extends AbstractGraph<V, E>
  implements ReadonlyGraph<V, E> {
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

export class ReadonlyWeightedGraph<V, E>
  extends ReadonlyUnweightedGraph<V, E>
  implements IReadonlyWeightedGraph<V, E> {
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
}
