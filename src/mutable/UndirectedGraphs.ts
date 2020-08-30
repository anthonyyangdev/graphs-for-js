import { AbstractMutableDirectedGraph } from './AbstractMutableDirectedGraph'
import { IGeneralNodeGraph, IWeightedGraph, ValueEdge } from '../types/GraphInterface'
import { GraphType } from '../types/GraphType'
import { NoEdgeWeight } from '../readonly/AbstractReadonlyDirectedGraph'
import { AbstractMutableUndirectedGraph } from './AbstractMutableUndirectedGraph'

export class UndirectedGraph<V, E=unknown>
  extends AbstractMutableUndirectedGraph<V, E>
  implements IGeneralNodeGraph<V, E> {
  constructor (fn?: (v: V) => string) {
    super(fn)
  }

  getGraphType (): GraphType {
    return GraphType.NonWeightedUndirected
  }
}

export class WeightedUndirectedGraph<V, E>
  extends AbstractMutableDirectedGraph<V, E>
  implements IWeightedGraph<V, E> {
  constructor (fn?: (v: V) => string) {
    super(fn)
  }

  getEdgeValue (source: V, target: V): E | undefined {
    const value = this.sourceToTarget.getValue(source).getValue(target)
    if (value === NoEdgeWeight) return undefined
    else return value as E | undefined
  }

  getGraphType (): GraphType {
    return GraphType.WeightedUndirected
  }

  hasEdge (source: V, target: V, value?: E): boolean {
    return super.hasEdge(source, target, value)
  }

  edges (): ValueEdge<V, E>[] {
    return super.edges().map((e) => {
      return { ...e, value: e.value as E }
    })
  }

  incomingEdgesOf (target: V): ValueEdge<V, E>[] {
    return super.incomingEdgesOf(target).map((e) => {
      return { ...e, value: e.value as E }
    })
  }

  outgoingEdgesOf (source: V): ValueEdge<V, E>[] {
    return super.outgoingEdgesOf(source).map((e) => {
      return { ...e, value: e.value as E }
    })
  }
}
