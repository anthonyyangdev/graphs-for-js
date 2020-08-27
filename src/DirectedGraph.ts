import { BasicEdge, GraphInterface } from './types/GraphInterface'
import { DefaultDictionary, Set } from 'typescript-collections'
import { AbstractNodeGraph } from './AbstractGraph'
import { GraphType } from './types/GraphType'

export class DirectedGraph<V> extends AbstractNodeGraph<V> implements GraphInterface<V> {
  getGraphType (): GraphType {
    return GraphType.NonValueDirected
  }

  protected readonly sourceToTarget: DefaultDictionary<V, Set<V>>
  protected readonly targetToSource: DefaultDictionary<V, Set<V>>

  constructor (toKey?: (v: V) => string) {
    super(toKey)
    this.targetToSource = new DefaultDictionary(() => {
      return new Set<V>(this.toKeyFn)
    }, this.toKeyFn)
    this.sourceToTarget = new DefaultDictionary(() => {
      return new Set<V>(this.toKeyFn)
    }, this.toKeyFn)
  }

  connect (source: V, target: V): boolean {
    if (this.graphNodes.contains(source) && this.graphNodes.contains(target)) {
      this.sourceToTarget.getValue(source).add(target)
      this.targetToSource.getValue(target).add(source)
      return true
    } else return false
  }

  disconnect (source: V, target: V): boolean {
    return this.sourceToTarget.getValue(source).remove(target) &&
    this.targetToSource.getValue(target).remove(source)
  }

  degreeOf (node: V): number {
    return this.sourceToTarget.getValue(node).size() + this.targetToSource.getValue(node).size()
  }

  edges (): BasicEdge<V>[] {
    const copy: BasicEdge<V>[] = []
    this.sourceToTarget.forEach((source, targets) => {
      targets.forEach((target) => {
        copy.push({ source, target })
      })
    })
    return copy
  }

  hasEdge (source: V, target: V): boolean {
    return this.sourceToTarget.getValue(source).contains(target)
  }

  incomingEdgesOf (target: V): BasicEdge<V>[] {
    const copy: BasicEdge<V>[] = []
    this.targetToSource.getValue(target).forEach((source) => {
      copy.push({ source, target })
    })
    return copy
  }

  outgoingEdgesOf (source: V): BasicEdge<V>[] {
    const copy: BasicEdge<V>[] = []
    this.sourceToTarget.getValue(source).forEach((target) => {
      copy.push({ source, target })
    })
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
