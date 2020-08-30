import { BasicEdge, IReadonlyGeneralNodeGraph } from '../types/GraphInterface'
import { GraphType } from '../types/GraphType'
import { DefaultDictionary, Set } from 'typescript-collections'
import { AbstractReadonlyNodeGraph } from './AbstractReadonlyNodeGraph'

export class ReadonlyUndirectedGraph<V, E=unknown>
  extends AbstractReadonlyNodeGraph<V, E>
  implements IReadonlyGeneralNodeGraph<V, E> {
  private readonly sourceToTarget: DefaultDictionary<V, Set<V>>
  private readonly targetToSource: DefaultDictionary<V, Set<V>>

  constructor (
    nodes: V[],
    edges: [V, V][],
    keyFn?: (v: V) => string) {
    super(nodes, keyFn)
    this.sourceToTarget = new DefaultDictionary(() => {
      return new Set<V>(this.toKeyFn)
    }, this.toKeyFn)
    this.targetToSource = new DefaultDictionary(() => {
      return new Set<V>(this.toKeyFn)
    }, this.toKeyFn)
    edges.forEach(e => {
      this.sourceToTarget.getValue(e[0]).add(e[1])
      this.targetToSource.getValue(e[1]).add(e[0])
    }, this)
  }

  degreeOf (node: V): number {
    return this.sourceToTarget.getValue(node).size()
  }

  edges (): BasicEdge<V, E>[] {
    const copy: BasicEdge<V, E>[] = []
    this.sourceToTarget.forEach((source, targets) => {
      targets.forEach(target => {
        copy.push({
          source,
          target,
          undirected: false
        })
      })
    })
    return copy
  }

  getGraphType (): GraphType {
    return GraphType.ReadonlyNonWeightedDirected
  }

  hasEdge (source: V, target: V, _?: any): boolean {
    return this.sourceToTarget.getValue(source).contains(target)
  }

  inDegreeOf (node: V): number {
    return this.targetToSource.getValue(node).size()
  }

  outDegreeOf (node: V): number {
    return this.sourceToTarget.getValue(node).size()
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
}
