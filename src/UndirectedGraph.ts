import { DirectedGraph } from './DirectedGraph'
import { BasicEdge } from './types/GraphInterface'
import { Set, DefaultDictionary } from 'typescript-collections'
import { GraphType } from './types/GraphType'

export class UndirectedGraph<V, E=unknown> extends DirectedGraph<V, E> {
  constructor (toKey?: (v: V) => string) {
    super(toKey)
  }

  getGraphType (): GraphType {
    return GraphType.NonWeightedUndirected
  }

  degreeOf (node: V): number {
    return super.inDegreeOf(node)
  }

  connect (source: V, target: V): boolean {
    return super.connect(source, target) && super.connect(target, source)
  }

  disconnect (source: V, target: V): boolean {
    return super.disconnect(source, target) && super.disconnect(target, source)
  }

  /**
   * Forward and backward edges are treated as a single edge
   */
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
}
