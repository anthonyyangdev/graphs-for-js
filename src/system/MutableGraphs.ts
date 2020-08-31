import {
  ReadonlyGraph,
  IReadonlyWeightedGraph,
  ValueEdge,
  MutableGraph,
  IMutableWeightedGraph
} from '../types/GraphSystem'
import { DefaultDictionary, Dictionary, Set } from 'typescript-collections'
import { defaultToKeyFunction } from '../DefaultKeyFunction'
import { BasicEdge } from '../types/GraphInterface'
import { GraphType } from '../types/GraphType'

export class MutableUnweightedGraph<V, E=null>
implements MutableGraph<V, E> {
  readonly toKeyFn: (v: V) => string
  protected readonly allNodes: Set<V>
  protected readonly sourceToTarget: DefaultDictionary<V, Dictionary<V, E | null>>
  protected readonly targetToSource: DefaultDictionary<V, Dictionary<V, E | null>>
  protected readonly isUndirected: boolean
  protected readonly isUnweighted: boolean

  constructor (
    isUndirected: boolean,
    isUnweighted: boolean,
    keyFn?: (v: V) => string
  ) {
    this.toKeyFn = keyFn ?? defaultToKeyFunction
    this.allNodes = new Set<V>(this.toKeyFn)
    this.isUndirected = isUndirected
    this.isUnweighted = isUnweighted
    this.sourceToTarget = new DefaultDictionary(() => {
      return new Dictionary<V, null | E>(this.toKeyFn)
    }, this.toKeyFn)
    this.targetToSource = new DefaultDictionary(() => {
      return new Dictionary<V, null | E>(this.toKeyFn)
    }, this.toKeyFn)
  }

  contains (...nodes: V[]): boolean {
    return nodes.every(n => this.allNodes.contains(n), this)
  }

  count (): number {
    return this.allNodes.size()
  }

  nodes (): V[] {
    return this.allNodes.toArray()
  }

  degreeOf (node: V) {
    if (this.isUndirected) {
      return this.outDegreeOf(node) + this.inDegreeOf(node)
    } else {
      const edges = this.sourceToTarget.getValue(node)
      return edges.size() + (edges.containsKey(node) ? 1 : 0)
    }
  }

  edges (): BasicEdge<V, E>[] {
    const copy: BasicEdge<V, E>[] = []
    this.sourceToTarget.forEach((source, targets) => {
      targets.forEach((target, value) => {
        copy.push({
          source,
          target,
          value: value !== null ? (value as E) : undefined,
          undirected: this.isUndirected
        })
      })
    })
    return copy
  }

  incomingEdgesOf (target: V): BasicEdge<V, E>[] {
    const copy: BasicEdge<V, E>[] = []
    this.targetToSource.getValue(target).forEach((source, value) => {
      copy.push({
        source,
        target,
        value: value != null ? value : undefined,
        undirected: this.isUndirected
      })
    })
    return copy
  }

  outgoingEdgesOf (source: V): BasicEdge<V, E>[] {
    const copy: BasicEdge<V, E>[] = []
    this.sourceToTarget.getValue(source).forEach((target, value) => {
      copy.push({
        source,
        target,
        value: value != null ? value : undefined,
        undirected: this.isUndirected
      })
    })
    return copy
  }

  hasEdge (source: V, target: V, value?: any): boolean {
    if (value == null) {
      return this.sourceToTarget.getValue(source).containsKey(target)
    } else {
      const edgeValue = this.sourceToTarget.getValue(source).getValue(target)
      return (edgeValue !== undefined) && edgeValue === value
    }
  }

  inDegreeOf (node: V): number {
    return this.targetToSource.getValue(node).size()
  }

  outDegreeOf (node: V): number {
    return this.sourceToTarget.getValue(node).size()
  }

  getGraphType (): GraphType {
    return GraphType.ReadonlyWeightedDirected
  }

  connect (source: V, target: V, value?: any): boolean {
    if (!this.contains(source, target)) { return false }
    if (this.isUnweighted) { value = null }
    const prev = this.sourceToTarget.getValue(source).setValue(target, value)
    if (this.isUndirected) {
      this.targetToSource.getValue(target).setValue(source, value)
    }
    return prev == null || prev !== value
  }

  disconnect (source: V, target: V, value?: any): boolean {
    if (!this.contains(source, target)) return false
    const c = this.sourceToTarget.getValue(source).getValue(target)
    if (this.isUnweighted || value == null || value === c) {
      this.sourceToTarget.getValue(source).remove(target)
      if (this.isUndirected) { this.targetToSource.getValue(target).remove(source) }
      return true
    }
    return false
  }

  insert (...nodes: V[]): number {
    let count = 0
    for (const n of nodes) { count += this.allNodes.add(n) ? 1 : 0 }
    return count
  }

  remove (...nodes: V[]): number {
    let count = 0
    for (const n of nodes) { count += this.allNodes.remove(n) ? 1 : 0 }
    return count
  }
}

export class MutableWeightedGraph<V, E>
  extends MutableUnweightedGraph<V, E>
  implements IMutableWeightedGraph<V, E> {
  constructor (
    isUndirected: boolean,
    keyFn?: (v: V) => string
  ) {
    super(isUndirected, false, keyFn)
  }

  weightOf (source: V, target: V): E | undefined {
    const value = this.sourceToTarget.getValue(source).getValue(target)
    return value !== null ? value : undefined
  }

  edges (): ValueEdge<V, E>[] {
    return super.edges().map(e => {
      return { ...e, value: e.value as E }
    })
  }

  incomingEdgesOf (target: V): ValueEdge<V, E>[] {
    return super.incomingEdgesOf(target).map(e => {
      return { ...e, value: e.value as E }
    })
  }

  outgoingEdgesOf (source: V): ValueEdge<V, E>[] {
    return super.outgoingEdgesOf(source).map(e => {
      return { ...e, value: e.value as E }
    })
  }

  hasEdge (source: V, target: V, value?: E): boolean {
    return super.hasEdge(source, target, value)
  }

  connect (source: V, target: V, value: E): boolean {
    return super.connect(source, target, value)
  }

  disconnect (source: V, target: V, value?: E): boolean {
    return super.disconnect(source, target, value)
  }
}