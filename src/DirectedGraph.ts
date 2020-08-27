import { BasicEdge, Graph, ValueEdge } from './Graph'
import * as Collections from 'typescript-collections'
import { Set, DefaultDictionary, Dictionary } from 'typescript-collections'

const defaultToKey = (i: unknown) => Number.isFinite(i) ? `${i}` : Collections.util.makeString(i)

type EdgeValueWrapper<E> = { value: E | undefined }

export class DirectedGraph<V, E=never> implements Graph<V, E> {
  protected readonly graphNodes: Set<V>
  protected readonly sourceToTarget: DefaultDictionary<V, Dictionary<V, EdgeValueWrapper<E> >>
  protected readonly targetToSource: DefaultDictionary<V, Dictionary<V, EdgeValueWrapper<E>>>
  protected readonly toKeyFn: (v: V) => string

  constructor (toKey?: (v: V) => string) {
    this.toKeyFn = toKey ?? defaultToKey
    this.graphNodes = new Set<V>(this.toKeyFn)
    this.targetToSource = new DefaultDictionary(() => {
      return new Dictionary<V, EdgeValueWrapper<E>>(this.toKeyFn)
    }, this.toKeyFn)
    this.sourceToTarget = new DefaultDictionary(() => {
      return new Dictionary<V, EdgeValueWrapper<E>>(this.toKeyFn)
    }, this.toKeyFn)
  }

  count (): number {
    return this.graphNodes.size()
  }

  connect (source: V, target: V, value?: E): boolean {
    if (this.graphNodes.contains(source) && this.graphNodes.contains(target)) {
      this.sourceToTarget.getValue(source).setValue(target, { value })
      this.targetToSource.getValue(target).setValue(source, { value })
      return true
    } else return false
  }

  contains (...nodes: V[]): boolean {
    return nodes.every(n => this.graphNodes.contains(n))
  }

  cut (source: V, target: V, value?: E): boolean {
    const e = this.sourceToTarget.getValue(source).getValue(target)
    if (value == null || e?.value === value) {
      this.sourceToTarget.getValue(source).remove(target)
      return true
    }
    return false
  }

  degreeOf (node: V): number {
    return this.sourceToTarget.getValue(node).size() + this.targetToSource.getValue(node).size()
  }

  edges (): ValueEdge<V, E>[] {
    const copy: ValueEdge<V, E>[] = []
    this.sourceToTarget.forEach((source, targets) => {
      targets.forEach((target, v) => {
        copy.push({ source, target, value: v.value })
      })
    })
    return copy
  }

  hasEdge (source: V, target: V, value?: E): boolean {
    if (value == null) {
      return this.sourceToTarget.getValue(source).containsKey(target)
    } else {
      return value === this.sourceToTarget.getValue(source).getValue(target)?.value
    }
  }

  incomingEdgesOf (target: V): ValueEdge<V, E>[] {
    const copy: ValueEdge<V, E>[] = []
    this.targetToSource.getValue(target).forEach((source, v) => {
      copy.push({ source, target, value: v.value })
    })
    return copy
  }

  outgoingEdgesOf (source: V): ValueEdge<V, E>[] {
    const copy: ValueEdge<V, E>[] = []
    this.sourceToTarget.getValue(source).forEach((target, v) => {
      copy.push({ source, target, value: v.value })
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
