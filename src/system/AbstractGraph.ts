import { BasicEdge, ReadonlyUnweightedGraph } from '../types/GraphSystem'
import { DefaultDictionary, Dictionary, Set } from 'typescript-collections'
import { defaultToKeyFunction } from '../DefaultKeyFunction'

export abstract class AbstractGraph<V, E> implements ReadonlyUnweightedGraph<V, E> {
  readonly toKeyFn: (v: V) => string
  protected readonly allNodes: Set<V>
  protected readonly sourceToTarget: DefaultDictionary<V, Dictionary<V, E | null>>
  protected readonly targetToSource: DefaultDictionary<V, Dictionary<V, E | null>>
  public readonly isUndirected: boolean
  public readonly isUnweighted: boolean

  protected constructor (
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

  degreeOf (node: V): number {
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

  incomingEdgesOf (target: V): BasicEdge<V, E>[] {
    const edges: BasicEdge<V, E>[] = []
    this.targetToSource.getValue(target).forEach((source, value) => {
      edges.push({
        source,
        target,
        value: value != null ? value : undefined,
        undirected: this.isUndirected
      })
    })
    return edges
  }

  nodes (): V[] {
    return this.allNodes.toArray()
  }

  outDegreeOf (node: V): number {
    return this.sourceToTarget.getValue(node).size()
  }

  outgoingEdgesOf (source: V): BasicEdge<V, E>[] {
    const edges: BasicEdge<V, E>[] = []
    this.sourceToTarget.getValue(source).forEach((target, value) => {
      edges.push({
        source,
        target,
        value: value != null ? value : undefined,
        undirected: this.isUndirected
      })
    })
    return edges
  }
}
