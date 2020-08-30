import { BasicEdge, IGeneralNodeGraph, ValueEdge } from '../types/GraphInterface'
import { GraphType } from '../types/GraphType'
import { AbstractMutableDirectedGraph } from './AbstractMutableDirectedGraph'
import { DefaultDictionary, Set } from 'typescript-collections'
import { NoEdgeWeight } from '../readonly/AbstractReadonlyDirectedGraph'

export abstract class AbstractMutableUndirectedGraph<V, E=unknown>
  extends AbstractMutableDirectedGraph<V, E>
  implements IGeneralNodeGraph<V, E> {
  protected constructor (toKey?: (v: V) => string) {
    super(toKey)
  }

  degreeOf (node: V): number {
    const edges = this.sourceToTarget.getValue(node)
    return edges.size() + (edges.containsKey(node) ? 1 : 0)
  }

  connect (source: V, target: V, value?: any): boolean {
    const firstDel = super.connect(source, target, value)
    const secondDel = super.connect(target, source, value)
    return firstDel || secondDel
  }

  disconnect (source: V, target: V, value?: any): boolean {
    const firstDel = super.disconnect(source, target, value)
    const secondDel = super.disconnect(target, source, value)
    return firstDel || secondDel
  }

  edges (): BasicEdge<V, E>[] {
    const edges: BasicEdge<V, E>[] = []
    const addedAliasEdge = new DefaultDictionary<V, Set<V>>(() => {
      return new Set<V>(this.toKeyFn)
    }, this.toKeyFn)
    this.sourceToTarget.forEach((source, targets) => {
      targets.forEach((target, v) => {
        if (!addedAliasEdge.getValue(source).contains(target)) {
          edges.push({
            source,
            target,
            value: v !== NoEdgeWeight ? v as E : undefined,
            undirected: true
          })
          addedAliasEdge.getValue(target).add(source)
        }
      })
    })
    return edges
  }

  abstract getGraphType(): GraphType
}
