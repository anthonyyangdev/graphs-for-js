import { GraphInterface } from '../types/GraphInterface'
import { Dictionary, Queue, Set } from 'typescript-collections'

export const findShortestPath = <V, E> (graph: GraphInterface<V, E>, start: V, end: V): {
  path: V[]
  pathSize: number
} => {
  if (!graph.contains(start, end)) {
    return { path: [], pathSize: -1 }
  }
  const target = graph.toKeyFn(end)
  if (graph.toKeyFn(start) === target) {
    return { path: [start], pathSize: 0 }
  }

  const parentMap = new Dictionary<V, V>(graph.toKeyFn)
  const bfsQueue = new Queue<V>()
  bfsQueue.enqueue(start)
  const visitedNodes = new Set<V>(graph.toKeyFn)
  let foundEnd = false

  while (!bfsQueue.isEmpty() && !foundEnd) {
    const node = bfsQueue.dequeue() as V
    if (!visitedNodes.contains(node)) {
      visitedNodes.add(node)
      const outgoingEdges = graph.outgoingEdgesOf(node)
      for (const edge of outgoingEdges) {
        parentMap.setValue(edge.target, node)
        if (graph.toKeyFn(edge.target) === target) {
          foundEnd = true
          break
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
