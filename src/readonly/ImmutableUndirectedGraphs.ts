import { BasicEdge, IReadonlyGeneralNodeGraph, IReadonlyWeightedGraph, ValueEdge } from '../types/GraphInterface'
import { GraphType } from '../types/GraphType'
import { AbstractReadonlyDirectedGraph, NoEdgeWeight } from './AbstractReadonlyDirectedGraph'
import { DefaultDictionary, Set } from 'typescript-collections'
import { AbstractReadonlyUndirectedGraph } from './AbstractReadonlyUndirectedGraph'

export class ReadonlyUndirectedGraph<V, E=unknown>
  extends AbstractReadonlyUndirectedGraph<V, E>
  implements IReadonlyGeneralNodeGraph<V, E> {
  constructor (
    nodes: V[],
    edges: [V, V][],
    keyFn?: (v: V) => string
  ) {
    super(nodes, edges.map(x => [...x, undefined]), keyFn)
  }

  getGraphType (): GraphType {
    return GraphType.ReadonlyNonWeightedUndirected
  }
}

export class ReadonlyWeightedUndirectedGraph<V, E>
  extends AbstractReadonlyUndirectedGraph<V, E>
  implements IReadonlyWeightedGraph<V, E> {
  getGraphType (): GraphType {
    return GraphType.ReadonlyWeightedDirected
  }

  constructor (
    nodes: V[],
    edges: [V, V, E][],
    keyFn?: (v: V) => string
  ) {
    super(nodes, edges, keyFn)
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
    return super.edges().map((e) => {
      return { ...e, value: e.value as E }
    })
  }

  outgoingEdgesOf (source: V): ValueEdge<V, E>[] {
    return super.outgoingEdgesOf(source).map((e) => {
      return { ...e, value: e.value as E }
    })
  }

  getEdgeValue (source: V, target: V): E | undefined {
    const value = this.sourceToTarget.getValue(source).getValue(target)
    return value as E | undefined
  }
}
