import {Graph} from "./Graph";
import * as Collections from 'typescript-collections';
import {Set, DefaultDictionary} from 'typescript-collections';

interface Edge<V> {
  source: V
  target: V
}

export class DirectedGraph<V> implements Graph<V, Edge<V>>{

  private readonly graphNodes: Set<V>
  private readonly sourceToTarget: DefaultDictionary<V, Set<V>>
  private readonly targetToSource: DefaultDictionary<V, Set<V>>

  constructor(config?: {
    hash: (v: V) => string,
    areEqual: (v1: V, v2: V) => boolean
  }) {
    const toKeyFn = config?.hash ?? ((i: V) => Number.isFinite(i) ? `${i}` : Collections.util.makeString(i))
    this.graphNodes = new Set<V>(toKeyFn)
    this.targetToSource = new DefaultDictionary(() => new Set<V>(), toKeyFn)
    this.sourceToTarget = new DefaultDictionary(() => new Set<V>(), toKeyFn)
  }

  count(): number {
    return this.graphNodes.size()
  }

  connect(source: V, target: V): boolean {
    return this.targetToSource.getValue(target).add(source)
      && this.sourceToTarget.getValue(source).add(target);
  }

  contains(nodes: V): boolean {
    return this.graphNodes.contains(nodes)
  }

  cut(source: V, target: V): boolean {
    return this.sourceToTarget.getValue(source).remove(target)
  }

  degreeOf(node: V): number {
    return this.sourceToTarget.getValue(node).size() + this.targetToSource.getValue(node).size()
  }

  edges(): Set<Edge<V>> {
    const copy = new Set<Edge<V>>()
    this.sourceToTarget.forEach((source, v) => {
      v.forEach(target => copy.add({source, target}))
    })
    this.targetToSource.forEach((target, v) => {
      v.forEach(source => copy.add({source, target}))
    })
    return copy
  }

  hasEdge(source: V, target: V): boolean {
    return this.sourceToTarget.getValue(source).contains(target)
  }

  incomingEdgesOf(target: V): Set<Edge<V>> {
    const copy = new Set<Edge<V>>()
    this.targetToSource.getValue(target).forEach(source => {
      copy.add({source, target});
    })
    return copy;
  }

  insert(...nodes: V[]): number {
    let count = 0
    for (let n of nodes) {
      const added = this.graphNodes.add(n)
      if (added) {
        count++
      }
    }
    return count
  }

  nodes(): Set<V> {
    const copy = new Set<V>()
    this.graphNodes.forEach(n => copy.add(n))
    return copy
  }

  outgoingEdgesOf(source: V): Set<Edge<V>> {
    const copy = new Set<Edge<V>>()
    this.sourceToTarget.getValue(source).forEach(target => {
      copy.add({source, target});
    })
    return copy;
  }

  remove(...nodes: V[]): number {
    let count = 0
    for (let n of nodes) {
      if (this.graphNodes.contains(n)) {
        this.graphNodes.remove(n)
        this.targetToSource.remove(n)
        this.sourceToTarget.remove(n)
        count++
      }
    }
    return count
  }

}
