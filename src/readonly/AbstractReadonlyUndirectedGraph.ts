import { BasicEdge } from '../types/GraphInterface'
import { DefaultDictionary, Set } from 'typescript-collections'
import { GraphType } from '../types/GraphType'
import { AbstractReadonlyDirectedGraph, NoEdgeWeight } from './AbstractReadonlyDirectedGraph'

/**
 * @deprecated Use ReadonlyUndirectedGraph
 */
export abstract class AbstractReadonlyUndirectedGraph<V, E=unknown>
  extends AbstractReadonlyDirectedGraph<V, E> {
  protected constructor (
    nodes: V[],
    edges: [V, V, E | undefined][],
    keyFn?: (v: V) => string
  ) {
    super(nodes, edges, keyFn)
  }

  degreeOf (node: V) {
    const edges = this.sourceToTarget.getValue(node)
    return edges.size() + (edges.containsKey(node) ? 1 : 0)
  }

  inDegreeOf (node: V): number {
    const edges = this.targetToSource.getValue(node)
    return edges.size() + (edges.containsKey(node) ? 1 : 0)
  }

  outDegreeOf (node: V): number {
    const edges = this.sourceToTarget.getValue(node)
    return edges.size() + (edges.containsKey(node) ? 1 : 0)
  }

  edges (): BasicEdge<V, E>[] {
    const edges: BasicEdge<V, E>[] = []
    const addedAliasEdge = new DefaultDictionary<V, Set<V>>(() => {
      return new Set<V>(this.toKeyFn)
    }, this.toKeyFn)
    this.sourceToTarget.forEach((source, targets) => {
      targets.forEach((target, value) => {
        if (!addedAliasEdge.getValue(source).contains(target)) {
          edges.push({
            source,
            target,
            undirected: true,
            value: value !== NoEdgeWeight ? value as E : undefined
          })
          addedAliasEdge.getValue(target).add(source)
        }
      })
    })
    return edges
  }

  abstract getGraphType (): GraphType
}
