import { DirectedGraph } from './DirectedGraph'
import { BasicEdge, GraphInterface } from './GraphInterface'
import { Set, DefaultDictionary } from 'typescript-collections'

class UndirectedGraph<V> extends DirectedGraph<V> {
  constructor (toKey?: (v: V) => string) {
    super(toKey)
  }

  connect (source: V, target: V): boolean {
    return super.connect(source, target) && super.connect(target, source)
  }

  cut (source: V, target: V): boolean {
    return super.cut(source, target) && super.cut(target, source)
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
