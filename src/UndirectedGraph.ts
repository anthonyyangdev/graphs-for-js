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

  edges (): BasicEdge<V>[] {
    const edges: BasicEdge<V>[] = []
    const addedAliasEdge = new DefaultDictionary<V, Set<V>>(() => new Set<V>())
    this.sourceToTarget.forEach((source, targets) => {
      targets.forEach(target => {
        if (!addedAliasEdge.getValue(target).contains(source)) { edges.push({ source, target }) }
      })
    })
    return edges
  }
}
