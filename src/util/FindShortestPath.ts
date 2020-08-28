import { GraphInterface } from '../types/GraphInterface'
import { Dictionary, Queue, Set } from 'typescript-collections'

const fixed = <V> (graph: GraphInterface<V>, start: V, end: V): {
  path: V[]
  pathSize: number
} => {
  const parentMap = new Dictionary<V, V>(graph.toKeyFn)
  const bfsQueue = new Queue<V>()
  bfsQueue.enqueue(start)
  const visitedNodes = new Set<V>(graph.toKeyFn)
  const target = graph.toKeyFn(end)
  let foundEnd = false
  while (!bfsQueue.isEmpty() && !foundEnd) {
    const node = bfsQueue.dequeue() as V
    if (graph.toKeyFn(node) === target) {
      foundEnd = true
    } else if (!visitedNodes.contains(node)) {
      visitedNodes.add(node)
      const outgoingEdges = graph.outgoingEdgesOf(node)
      for (const edge of outgoingEdges) {
        if (graph.toKeyFn(edge.target) === target) {
          parentMap.setValue(edge.target, node)
          foundEnd = true
        } else {
          bfsQueue.enqueue(edge.target)
        }
      }
    }
  }
  if (foundEnd) {
    const path = []
    let node = end
    const startKey = graph.toKeyFn(start)
    while (graph.toKeyFn(node) !== startKey) {
      path.push(node)
      node = parentMap.getValue(node) as V
    }
    path.push(start)
    return { path: path.reverse(), pathSize: path.length - 1 }
  } else {
    return { path: [], pathSize: -1 }
  }
}

/**
 * Finds shortest path via BFS
 *
 * 1 -- 2 -- 3 -- 10
 * \          \
 *  \-- 4 --6--7- 5 (end)
 *
 * @param graph
 * @param start
 * @param end
 */
export const findShortestPath = <V> (graph: GraphInterface<V>, start: V, end: V): {
  path: V[]
  pathSize: number
} => {
  return fixed(graph, start, end)
}
