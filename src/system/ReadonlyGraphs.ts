import { IReadonlyWeightedGraph, ReadonlyGraph, ValueEdge } from '../types/GraphSystem'
import { DefaultDictionary, Dictionary, Set } from 'typescript-collections'
import { defaultToKeyFunction } from '../DefaultKeyFunction'
import { BasicEdge } from '../types/GraphInterface'
import { GraphType } from '../types/GraphType'

export class ReadonlyUnweightedGraph<V, E=null> implements ReadonlyGraph<V, E> {
  readonly toKeyFn: (v: V) => string
  protected readonly allNodes: Set<V>
  protected readonly sourceToTarget: DefaultDictionary<V, Dictionary<V, E | null>>
  protected readonly targetToSource: DefaultDictionary<V, Dictionary<V, E | null>>
  public readonly isUndirected: boolean
  public readonly isUnweighted: boolean

  constructor (
    nodes: V[],
    edges: ([V, V] | [V, V, E])[],
    isUndirected: boolean,
    isUnweighted: boolean,
    keyFn?: (v: V) => string
  ) {
    this.toKeyFn = keyFn ?? defaultToKeyFunction
    this.allNodes = new Set<V>(this.toKeyFn)
    this.isUndirected = isUndirected
    this.isUnweighted = isUnweighted
    nodes.forEach(n => this.allNodes.add(n), this)

    this.sourceToTarget = new DefaultDictionary(() => {
      return new Dictionary<V, null | E>(this.toKeyFn)
    }, this.toKeyFn)
    this.targetToSource = new DefaultDictionary(() => {
      return new Dictionary<V, null | E>(this.toKeyFn)
    }, this.toKeyFn)
    edges.forEach(e => {
      const value = e[2] !== undefined ? e[2] : null
      this.sourceToTarget.getValue(e[0]).setValue(e[1], value)
      this.targetToSource.getValue(e[1]).setValue(e[0], value)
      if (this.isUndirected) {
        this.sourceToTarget.getValue(e[1]).setValue(e[0], value)
        this.targetToSource.getValue(e[0]).setValue(e[1], value)
      }
    }, this)
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
      const edges = this.sourceToTarget.getValue(node)
      return edges.size() + (edges.containsKey(node) ? 1 : 0)
    } else {
      return this.outDegreeOf(node) + this.inDegreeOf(node)
    }
  }

  edges (): BasicEdge<V, E>[] {
    const edges: BasicEdge<V, E>[] = []
    const addedAliasEdge = new DefaultDictionary<V, Set<V>>(() => {
      return new Set<V>(this.toKeyFn)
    }, this.toKeyFn)
    this.sourceToTarget.forEach((source, targets) => {
      targets.forEach((target, v) => {
        if (!this.isUndirected || !addedAliasEdge.getValue(source).contains(target)) {
          edges.push({
            source,
            target,
            value: v !== null ? v as E : undefined,
            undirected: this.isUndirected
          })
          addedAliasEdge.getValue(target).add(source)
        }
      })
    })
    return edges
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
    if (this.isUnweighted || value == null) {
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
    if (this.isUnweighted && this.isUndirected) {
      return GraphType.ReadonlyNonWeightedUndirected
    } else if (this.isUndirected) {
      return GraphType.ReadonlyWeightedUndirected
    } else if (this.isUnweighted) {
      return GraphType.ReadonlyNonWeightedDirected
    } else {
      return GraphType.ReadonlyWeightedDirected
    }
  }
}

export class ReadonlyWeightedGraph<V, E>
  extends ReadonlyUnweightedGraph<V, E>
  implements IReadonlyWeightedGraph<V, E> {
  constructor (
    nodes: V[],
    edges: [V, V, E][],
    isUndirected: boolean,
    keyFn?: (v: V) => string
  ) {
    super(nodes, edges, isUndirected, false, keyFn)
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
}
