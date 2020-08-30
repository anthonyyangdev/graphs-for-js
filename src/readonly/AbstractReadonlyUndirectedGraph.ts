import { BasicEdge } from '../types/GraphInterface'
import { DefaultDictionary, Set } from 'typescript-collections'
import { GraphType } from '../types/GraphType'
import { AbstractReadonlyDirectedGraph } from './AbstractReadonlyDirectedGraph'

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
    return this.inDegreeOf(node)
  }

  edges (): BasicEdge<V, E>[] {
    const edges: BasicEdge<V, E>[] = []
    const addedAliasEdge = new DefaultDictionary<V, Set<V>>(() => {
      return new Set<V>(this.toKeyFn)
    }, this.toKeyFn)
    this.sourceToTarget.forEach((source, targets) => {
      targets.forEach(target => {
        if (!addedAliasEdge.getValue(source).contains(target)) {
          edges.push({ source, target, undirected: true })
          addedAliasEdge.getValue(target).add(source)
        }
      })
    })
    return edges
  }

  abstract getGraphType (): GraphType
}
