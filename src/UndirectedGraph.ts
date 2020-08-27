import { DirectedGraph } from './DirectedGraph'
import { BasicEdge } from './GraphInterface'
import { Set, DefaultDictionary } from 'typescript-collections'
import { GraphType } from './GraphType'

export class UndirectedGraph<V> extends DirectedGraph<V> {
  constructor (toKey?: (v: V) => string) {
    super(toKey)
  }

  getGraphType (): GraphType {
    return GraphType.NonValueUndirected
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
  edges (): BasicEdge<V>[] {
    const edges: BasicEdge<V>[] = []
    const addedAliasEdge = new DefaultDictionary<V, Set<V>>(() => {
      return new Set<V>(this.toKeyFn)
    }, this.toKeyFn)
    this.sourceToTarget.forEach((source, targets) => {
      targets.forEach(target => {
        if (!addedAliasEdge.getValue(source).contains(target)) {
          edges.push({ source, target })
          addedAliasEdge.getValue(target).add(source)
        }
      })
    })
    return edges
  }
}
