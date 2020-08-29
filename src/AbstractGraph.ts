import { BasicEdge, GraphInterface } from './types/GraphInterface'
import { Set } from 'typescript-collections'
import * as Collections from 'typescript-collections'
import { GraphType } from './types/GraphType'

/**
 * The default Key Function.
 * @param i
 */
function defaultToKeyFunction (i: unknown) {
  if (typeof i === 'symbol') {
    return i.toString()
  } else if (i !== null && typeof i === 'object') {
    return Collections.util.makeString(i)
  } else {
    return `${i}`
  }
}

export abstract class AbstractNodeGraph<V> implements GraphInterface<V> {
  protected readonly graphNodes: Set<V>

  readonly toKeyFn: (v: V) => string

  protected constructor (toKey?: (v: V) => string) {
    this.toKeyFn = toKey ?? defaultToKeyFunction
    this.graphNodes = new Set<V>(this.toKeyFn)
  }

  contains (...nodes: V[]): boolean {
    return nodes.every(n => this.graphNodes.contains(n))
  }

  count (): number {
    return this.graphNodes.size()
  }

  insert (...nodes: V[]): number {
    let count = 0
    for (const n of nodes) {
      if (typeof n === 'undefined') {
        // undefined as its own type cannot be added to this Set structure.
        count += this.graphNodes.add(this.toKeyFn(n) as any) ? 1 : 0
      } else {
        count += this.graphNodes.add(n) ? 1 : 0
      }
    }
    return count
  }

  nodes (): V[] {
    return this.graphNodes.toArray()
  }

  abstract degreeOf(node: V): number

  abstract remove(...nodes: V[]): number

  abstract edges(): BasicEdge<V>[]

  abstract incomingEdgesOf(node: V): BasicEdge<V>[]

  abstract outgoingEdgesOf(node: V): BasicEdge<V>[]

  abstract getGraphType(): GraphType

  abstract connect(source: V, target: V, value?: any): boolean

  abstract disconnect(source: V, target: V, value?: any): boolean

  abstract hasEdge(source: V, target: V, value?: any): boolean

  abstract inDegreeOf(node: V): number

  abstract outDegreeOf(node: V): number
}
