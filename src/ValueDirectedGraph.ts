import { ValueEdge, ValueGraph } from './GraphInterface'
import { DefaultDictionary, Dictionary } from 'typescript-collections'
import { AbstractNodeGraph } from './AbstractGraph'

type EdgeValueWrapper<E> = { value: E }

export class ValueDirectedGraph<V, E>
  extends AbstractNodeGraph<V>
  implements ValueGraph<V, E> {
  protected readonly sourceToTarget: DefaultDictionary<V, Dictionary<V, EdgeValueWrapper<E>>>
  protected readonly targetToSource: DefaultDictionary<V, Dictionary<V, EdgeValueWrapper<E>>>

  constructor (toKey?: (v: V) => string) {
    super(toKey)
    this.targetToSource = new DefaultDictionary(() => {
      return new Dictionary<V, EdgeValueWrapper<E>>(this.toKeyFn)
    }, this.toKeyFn)
    this.sourceToTarget = new DefaultDictionary(() => {
      return new Dictionary<V, EdgeValueWrapper<E>>(this.toKeyFn)
    }, this.toKeyFn)
  }

  connect (source: V, target: V, value: E): boolean {
    if (this.graphNodes.contains(source) && this.graphNodes.contains(target)) {
      this.sourceToTarget.getValue(source).setValue(target, { value })
      this.targetToSource.getValue(target).setValue(source, { value })
      return true
    } else return false
  }

  cut (source: V, target: V, value: E): boolean {
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

  hasEdge (source: V, target: V, value: E): boolean {
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

  remove (...nodes: V[]): number {
    let count = 0
    for (const n of nodes) {
      if (this.graphNodes.contains(n)) {
        this.targetToSource.getValue(n).forEach((s, _) => {
          this.sourceToTarget.getValue(s).remove(n)
        })
        this.sourceToTarget.getValue(n).forEach((t, _) => {
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
