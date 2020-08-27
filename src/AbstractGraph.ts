import { BasicEdge, GraphInterface } from './GraphInterface'
import { Set } from 'typescript-collections'
import * as Collections from 'typescript-collections'
import { GraphType } from './GraphType'

const defaultToKey = (i: unknown) => Number.isFinite(i) ? `${i}` : Collections.util.makeString(i)

export abstract class AbstractNodeGraph<V> implements GraphInterface<V> {
  protected readonly graphNodes: Set<V>
  protected readonly toKeyFn: (v: V) => string

  protected constructor (toKey?: (v: V) => string) {
    this.toKeyFn = toKey ?? defaultToKey
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
      const added = this.graphNodes.add(n)
      if (added) {
        count++
      }
    }
    return count
  }

  nodes (): Set<V> {
    const copy = new Set<V>(this.toKeyFn)
    this.graphNodes.forEach(n => copy.add(n))
    return copy
  }

  abstract degreeOf(node: V): number

  abstract remove(...nodes: V[]): number

  abstract edges(): BasicEdge<V>[]

  abstract incomingEdgesOf(node: V): BasicEdge<V>[]

  abstract outgoingEdgesOf(node: V): BasicEdge<V>[]

  abstract getGraphType(): GraphType
}
