import { IGeneralNodeGraph } from '../types/GraphInterface'
import { GraphType } from '../types/GraphType'
import { AbstractReadonlyDirectedGraph, NoEdgeWeight } from '../readonly/AbstractReadonlyDirectedGraph'

/**
 * @deprecated
 */
export abstract class AbstractMutableDirectedGraph<V, E=unknown>
  extends AbstractReadonlyDirectedGraph<V, E>
  implements IGeneralNodeGraph<V, E> {
  protected constructor (toKey?: (v: V) => string) {
    super([], [], toKey)
  }

  insert (...nodes: V[]): number {
    let count = 0
    for (const n of nodes) {
      if (typeof n === 'undefined') {
        // undefined as its own type cannot be added to this Set structure.
        count += this.allNodes.add(this.toKeyFn(n) as any) ? 1 : 0
      } else {
        count += this.allNodes.add(n) ? 1 : 0
      }
    }
    return count
  }

  remove (...nodes: V[]): number {
    let count = 0
    for (const n of nodes) {
      if (this.allNodes.contains(n)) {
        this.targetToSource.getValue(n).forEach(s => {
          this.sourceToTarget.getValue(s).remove(n)
        })
        this.sourceToTarget.getValue(n).forEach(t => {
          this.targetToSource.getValue(t).remove(n)
        })
        this.targetToSource.remove(n)
        this.sourceToTarget.remove(n)
        this.allNodes.remove(n)
        count++
      }
    }
    return count
  }

  connect (source: V, target: V, value?: any): boolean {
    if (this.allNodes.contains(source) && this.allNodes.contains(target)) {
      const currentValue = this.sourceToTarget.getValue(source).getValue(target)
      if (
        currentValue === NoEdgeWeight ||
        currentValue === undefined ||
        currentValue !== value
      ) {
        value = value != null ? value : NoEdgeWeight
        this.sourceToTarget.getValue(source).setValue(target, value)
        this.targetToSource.getValue(target).setValue(source, value)
        return true
      }
    }
    return false
  }

  disconnect (source: V, target: V, value?: any): boolean {
    const e = this.sourceToTarget.getValue(source).getValue(target)
    if (e != null && (value == null || e === NoEdgeWeight || e === value)) {
      this.sourceToTarget.getValue(source).remove(target)
      this.targetToSource.getValue(target).remove(source)
      return true
    }
    return false
  }

  abstract getGraphType(): GraphType
}
