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
    const inverted: [V, V, undefined][] = edges.map(x => [x[1], x[0], undefined])
    super(nodes, inverted.concat(edges.map(x => [...x, undefined])), keyFn)
  }

  getGraphType (): GraphType {
    return GraphType.ReadonlyNonWeightedUndirected
  }
}

export class ReadonlyWeightedUndirectedGraph<V, E>
  extends AbstractReadonlyUndirectedGraph<V, E>
  implements IReadonlyWeightedGraph<V, E> {
  getGraphType (): GraphType {
    return GraphType.ReadonlyWeightedUndirected
  }

  constructor (
    nodes: V[],
    edges: [V, V, E][],
    keyFn?: (v: V) => string
  ) {
    const inverted: [V, V, E][] = edges.map(x => [x[1], x[0], x[2]])
    super(nodes, inverted.concat(edges), keyFn)
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

  getEdgeValue (source: V, target: V): E | undefined {
    const value = this.sourceToTarget.getValue(source).getValue(target)
    return value as E | undefined
  }
}
