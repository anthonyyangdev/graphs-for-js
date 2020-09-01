import { AbstractMutableDirectedGraph } from './AbstractMutableDirectedGraph'
import { IGeneralNodeGraph, IWeightedGraph, ValueEdge } from '../types/GraphInterface'
import { GraphType } from '../types/GraphType'
import { NoEdgeWeight } from '../readonly/AbstractReadonlyDirectedGraph'

/**
 * @deprecated
 */
export class DirectedGraph<V, E=unknown>
  extends AbstractMutableDirectedGraph<V, E>
  implements IGeneralNodeGraph<V, E> {
  constructor (fn?: (v: V) => string) {
    super(fn)
  }

  getGraphType (): GraphType {
    return GraphType.NonWeightedDirected
  }
}

/**
 * @deprecated
 */
export class WeightedDirectedGraph<V, E>
  extends AbstractMutableDirectedGraph<V, E>
  implements IWeightedGraph<V, E> {
  constructor (fn?: (v: V) => string) {
    super(fn)
  }

  connect (source: V, target: V, value: E): boolean {
    return super.connect(source, target, value)
  }

  disconnect (source: V, target: V, value?: E): boolean {
    return super.disconnect(source, target, value)
  }

  getEdgeValue (source: V, target: V): E | undefined {
    const value = this.sourceToTarget.getValue(source).getValue(target)
    if (value === NoEdgeWeight) return undefined
    else return value as E | undefined
  }

  getGraphType (): GraphType {
    return GraphType.WeightedDirected
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
