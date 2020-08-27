import { ValueDirectedGraph } from './ValueDirectedGraph'
import { GraphType } from './types/GraphType'
import { ValueEdge } from './types/GraphInterface'
import { DefaultDictionary, Set } from 'typescript-collections'

export class ValueUndirectedGraph<V, E> extends ValueDirectedGraph<V, E> {
  constructor (toKeyFn?: (v: V) => string) {
    super(toKeyFn)
  }

  getGraphType (): GraphType {
    return GraphType.ValueUndirected
  }

  connect (source: V, target: V, value: E): boolean {
    return super.connect(source, target, value) && super.connect(target, source, value)
  }

  disconnect (source: V, target: V, value: E): boolean {
    return super.disconnect(source, target, value) && super.disconnect(target, source, value)
  }

  edges (): ValueEdge<V, E>[] {
    const edges: ValueEdge<V, E>[] = []
    const addedAliasEdge = new DefaultDictionary<V, Set<V>>(() => {
      return new Set<V>(this.toKeyFn)
    }, this.toKeyFn)
    this.sourceToTarget.forEach((source, targets) => {
      targets.forEach((target, v) => {
        if (!addedAliasEdge.getValue(source).contains(target)) {
          edges.push({ source, target, value: v.value })
          addedAliasEdge.getValue(target).add(source)
        }
      })
    })
    return edges
  }
}
