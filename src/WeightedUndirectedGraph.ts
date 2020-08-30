import { WeightedDirectedGraph } from './WeightedDirectedGraph'
import { GraphType } from './types/GraphType'
import { ValueEdge } from './types/GraphInterface'
import { DefaultDictionary, Set } from 'typescript-collections'

/**
 * An implementation of an undirected graph that has weights in its edges.
 */
export class WeightedUndirectedGraph<V, E> extends WeightedDirectedGraph<V, E> {
  constructor (toKeyFn?: (v: V) => string) {
    super(toKeyFn)
  }

  getGraphType (): GraphType {
    return GraphType.WeightedUndirected
  }

  degreeOf (node: V): number {
    return super.inDegreeOf(node)
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
          edges.push({ source, target, value: v.value, undirected: true })
          addedAliasEdge.getValue(target).add(source)
        }
      })
    })
    return edges
  }
}
