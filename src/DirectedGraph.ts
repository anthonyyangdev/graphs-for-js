import { BasicEdge, IGeneralNodeGraph } from './types/GraphInterface'
import { DefaultDictionary, Set } from 'typescript-collections'
import { AbstractNodeGraph } from './AbstractNodeGraph'
import { GraphType } from './types/GraphType'

/**
 * An implementation of a directed graph without weights in its edges.
 */
export class DirectedGraph<V, E=unknown>
  extends AbstractNodeGraph<V, E> implements IGeneralNodeGraph<V, E> {
  getGraphType (): GraphType {
    return GraphType.NonWeightedDirected
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

  inDegreeOf (node: V): number {
    return this.targetToSource.getValue(node).size()
  }

  outDegreeOf (node: V): number {
    return this.sourceToTarget.getValue(node).size()
  }

  edges (): BasicEdge<V, E>[] {
    const copy: BasicEdge<V, E>[] = []
    this.sourceToTarget.forEach((source, targets) => {
      targets.forEach((target) => {
        copy.push({ source, target, undirected: false })
      })
    })
    return copy
  }

  hasEdge (source: V, target: V): boolean {
    return this.sourceToTarget.getValue(source).contains(target)
  }

  incomingEdgesOf (target: V): BasicEdge<V, E>[] {
    const copy: BasicEdge<V, E>[] = []
    this.targetToSource.getValue(target).forEach((source) => {
      copy.push({ source, target, undirected: false })
    })
    return copy
  }

  outgoingEdgesOf (source: V): BasicEdge<V, E>[] {
    const copy: BasicEdge<V, E>[] = []
    this.sourceToTarget.getValue(source).forEach((target) => {
      copy.push({ source, target, undirected: false })
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
