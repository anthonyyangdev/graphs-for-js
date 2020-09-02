import { ReadonlyUnweightedGraph } from '../types/GraphSystem'
import { hasCycle } from './HasCycle'
import { DefaultDictionary, Queue } from 'typescript-collections'

/**
 * Topologically sorts the nodes the in the graph.
 * If the graph is not a DAG, then the function returns undefined.
 * Otherwise, it returns the topological ordering as an array.
 * @param g
 */
export const topologicalSort = <V, E> (
  g: ReadonlyUnweightedGraph<V, E>
): V[] | undefined => {
  // Must be a DAG to be topologically sorted
  if ((g.isUndirected && g.edges().length > 0) || hasCycle(g)) { return undefined }

  const ordering: V[] = []
  const inDegrees = new DefaultDictionary<V, number>(() => 0, g.toKeyFn)
  g.nodes().forEach(n => inDegrees.setValue(n, g.inDegreeOf(n)))
  const queue = new Queue<V>()
  inDegrees.forEach((n, degrees) => {
    if (degrees === 0) { queue.enqueue(n) }
  })
  while (!queue.isEmpty()) {
    const node = queue.dequeue() as V
    ordering.push(node)
    const outgoing = g.outgoingEdgesOf(node)
    for (const { target } of outgoing) {
      inDegrees.setValue(target, inDegrees.getValue(target) - 1)
      if (inDegrees.getValue(target) === 0) { queue.enqueue(target) }
    }
  }
  return ordering
}
