import { BasicEdge, Graph } from './Graph'
import * as Collections from 'typescript-collections'
import { Set, DefaultDictionary } from 'typescript-collections'

const defaultToKey = (i: unknown) => Number.isFinite(i) ? `${i}` : Collections.util.makeString(i)

export class DirectedGraph<V> implements Graph<V, BasicEdge<V>> {
  protected readonly graphNodes: Set<V>
  protected readonly sourceToTarget: DefaultDictionary<V, Set<V>>
  protected readonly targetToSource: DefaultDictionary<V, Set<V>>
  protected readonly toKeyFn: (v: V) => string

  constructor (toKey?: (v: V) => string) {
    this.toKeyFn = toKey ?? defaultToKey
    this.graphNodes = new Set<V>(this.toKeyFn)
    this.targetToSource = new DefaultDictionary(() => new Set<V>(this.toKeyFn), this.toKeyFn)
    this.sourceToTarget = new DefaultDictionary(() => new Set<V>(this.toKeyFn), this.toKeyFn)
  }

  count (): number {
    return this.graphNodes.size()
  }

  connect (source: V, target: V): boolean {
    if (this.graphNodes.contains(source) && this.graphNodes.contains(target)) {
      return this.sourceToTarget.getValue(source).add(target) &&
          this.targetToSource.getValue(target).add(source)
    } else return false
  }

  contains (...nodes: V[]): boolean {
    return nodes.every(n => this.graphNodes.contains(n))
  }

  cut (source: V, target: V): boolean {
    return this.sourceToTarget.getValue(source).remove(target)
  }

  degreeOf (node: V): number {
    return this.sourceToTarget.getValue(node).size() + this.targetToSource.getValue(node).size()
  }

  edges (): BasicEdge<V>[] {
    const copy: BasicEdge<V>[] = []
    this.sourceToTarget.forEach((source, v) => {
      v.forEach(target => void copy.push({ source, target }))
    })
    return copy
  }

  hasEdge (source: V, target: V): boolean {
    return this.sourceToTarget.getValue(source).contains(target)
  }

  incomingEdgesOf (target: V): BasicEdge<V>[] {
    const copy: BasicEdge<V>[] = []
    this.targetToSource.getValue(target).forEach(source => {
      copy.push({ source, target })
    })
    return copy
  }

  outgoingEdgesOf (source: V): BasicEdge<V>[] {
    const copy: BasicEdge<V>[] = []
    this.sourceToTarget.getValue(source).forEach(target => {
      copy.push({ source, target })
    })
    return copy
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

  remove (...nodes: V[]): number {
    let count = 0
    for (const n of nodes) {
      if (this.graphNodes.contains(n)) {
        this.targetToSource.getValue(n).forEach(s => {
          this.sourceToTarget.getValue(s).remove(n)
        })
        this.sourceToTarget.getValue(n).forEach(t => {
          this.targetToSource.getValue(t).remove(n)
        })
        this.targetToSource.remove(n)
        this.sourceToTarget.remove(n)
        this.graphNodes.remove(n)
        count++
      }
    }
    return count
  }
}
