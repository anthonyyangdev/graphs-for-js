import { BasicEdge, IReadonlyGeneralNodeGraph } from '../types/GraphInterface'
import { Set } from 'typescript-collections'
import { defaultToKeyFunction } from '../DefaultKeyFunction'
import { GraphType } from '../types/GraphType'

export abstract class AbstractReadonlyNodeGraph<V, E=unknown>
implements IReadonlyGeneralNodeGraph<V, E> {
  readonly toKeyFn: (v: V) => string
  protected readonly allNodes: Set<V>

  protected constructor (
    nodes: V[],
    keyFn?: (v: V) => string
  ) {
    this.toKeyFn = keyFn ?? defaultToKeyFunction
    this.allNodes = new Set<V>(this.toKeyFn)
    nodes.forEach(n => this.allNodes.add(n), this)
  }

  contains (...nodes: V[]): boolean {
    return nodes.every(n => this.allNodes.contains(n))
  }

  count (): number {
    return this.allNodes.size()
  }

  nodes (): V[] {
    return this.allNodes.toArray()
  }

  abstract degreeOf (node: V): number

  abstract edges (): BasicEdge<V, E>[]

  abstract getGraphType (): GraphType

  abstract hasEdge (source: V, target: V, _?: any): boolean

  abstract inDegreeOf (node: V): number

  abstract outDegreeOf (node: V): number

  abstract incomingEdgesOf (target: V): BasicEdge<V, E>[]

  abstract outgoingEdgesOf (source: V): BasicEdge<V, E>[]
}
