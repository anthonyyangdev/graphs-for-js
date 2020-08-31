import { BasicEdge, IReadonlyGeneralNodeGraph } from '../types/GraphInterface'
import { DefaultDictionary, Dictionary, Set } from 'typescript-collections'
import { defaultToKeyFunction } from '../DefaultKeyFunction'
import { GraphType } from '../types/GraphType'

export const NoEdgeWeight = Symbol('There is no symbol associated with the edge.')

/**
 * @deprecated Use ReadonlyUndirectedGraph
 */
export abstract class AbstractReadonlyDirectedGraph<V, E=unknown>
implements IReadonlyGeneralNodeGraph<V, E> {
  readonly toKeyFn: (v: V) => string
  protected readonly allNodes: Set<V>
  protected readonly sourceToTarget: DefaultDictionary<V, Dictionary<V, E | symbol>>
  protected readonly targetToSource: DefaultDictionary<V, Dictionary<V, E | symbol>>

  protected constructor (
    nodes: V[],
    edges: [V, V, E | undefined][],
    keyFn?: (v: V) => string
  ) {
    this.toKeyFn = keyFn ?? defaultToKeyFunction
    this.allNodes = new Set<V>(this.toKeyFn)
    nodes.forEach(n => this.allNodes.add(n), this)

    this.sourceToTarget = new DefaultDictionary(() => {
      return new Dictionary<V, symbol | E>(this.toKeyFn)
    }, this.toKeyFn)
    this.targetToSource = new DefaultDictionary(() => {
      return new Dictionary<V, symbol | E>(this.toKeyFn)
    }, this.toKeyFn)
    edges.forEach(e => {
      const value = e[2] != null ? e[2] : NoEdgeWeight
      this.sourceToTarget.getValue(e[0]).setValue(e[1], value)
      this.targetToSource.getValue(e[1]).setValue(e[0], value)
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
    return this.outDegreeOf(node) + this.inDegreeOf(node)
  }

  edges (): BasicEdge<V, E>[] {
    const copy: BasicEdge<V, E>[] = []
    this.sourceToTarget.forEach((source, targets) => {
      targets.forEach((target, value) => {
        copy.push({
          source,
          target,
          value: value !== NoEdgeWeight ? (value as E) : undefined,
          undirected: false
        })
      })
    })
    return copy
  }

  hasEdge (source: V, target: V, value?: any): boolean {
    if (value == null) {
      return this.sourceToTarget.getValue(source).containsKey(target)
    } else {
      const edgeValue = this.sourceToTarget.getValue(source).getValue(target)
      return (edgeValue !== NoEdgeWeight) && edgeValue === value
    }
  }

  inDegreeOf (node: V): number {
    return this.targetToSource.getValue(node).size()
  }

  outDegreeOf (node: V): number {
    return this.sourceToTarget.getValue(node).size()
  }

  incomingEdgesOf (target: V): BasicEdge<V, E>[] {
    const copy: BasicEdge<V, E>[] = []
    this.targetToSource.getValue(target).forEach((source, value) => {
      copy.push({
        source,
        target,
        value: value !== NoEdgeWeight ? (value as E) : undefined,
        undirected: false
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
        value: value !== NoEdgeWeight ? (value as E) : undefined,
        undirected: false
      })
    })
    return copy
  }

  abstract getGraphType (): GraphType
}
