import { mapEdges } from './functional'
import { Dictionary, Queue, Set } from 'typescript-collections'
import { ReadonlyWeightedGraph } from '../system/ReadonlyGraphs'
import { MutableWeightedGraph } from '../system/MutableGraphs'
import { IReadonlyWeightedGraph } from '../types/GraphSystem'

/*
inputs
    C[n x n] : Capacity Matrix
    E[n x n] : Adjacency Matrix
    s : source
    t : sink
output
    f : maximum flow
Edmonds-Karp:
    f = 0             // Flow is initially 0
    F = [n x n]       // residual capacity array, capacity remaining
    while true:
        m, P = Breadth-First-Search(C, E, s, t, F)
            // Search for the next augmenting path
            // m is the residual capacity
            // P is the parent matrix
        if m = 0:
            break
        f = f + m
        v = t
        while v != s:
            u = P[v]
            F[u, v] = F[u, v] - m       //This is reducing the residual capacity of the augmenting path
            F[v, u] = F[v, u] + m        //This is increasing the residual capacity of the reverse edges
            v = u
    return f
 */
type MinMaxFlowType = {
  capacity: number,
  flow: number
}

const bfs = <V> (
  g: MutableWeightedGraph<V, MinMaxFlowType>,
  source: V,
  sink: V
): {path: {source: V, target: V, capacity: number, flow: number}[], bottleNeck: number } | undefined => {
  if (!g.contains(source, sink)) {
    return undefined
  }
  const target = g.toKeyFn(sink)
  if (g.toKeyFn(source) === target) {
    return { path: [], bottleNeck: 0 }
  }

  const parentMap = new Dictionary<V, {
    parent: V,
    flow: number,
    reverse: boolean
  }>(g.toKeyFn)
  const bfsQueue = new Queue<V>()
  bfsQueue.enqueue(source)
  const visitedNodes = new Set<V>(g.toKeyFn)
  let foundEnd = false

  /**
   * Checks if the next node is the target, otherwise adds it to the queue.
   * @param flow
   * @param currentNode
   * @param nextNode
   * @param reverse
   */
  function foundTarget (
    flow: number,
    currentNode: V,
    nextNode: V,
    reverse: boolean
  ) {
    if (flow <= 0) {
      parentMap.setValue(nextNode, { parent: currentNode, flow, reverse })
      if (g.toKeyFn(nextNode) === target) return true
      else bfsQueue.enqueue(nextNode)
    }
    return false
  }

  while (!bfsQueue.isEmpty() && !foundEnd) {
    const node = bfsQueue.dequeue() as V
    if (!visitedNodes.contains(node)) {
      visitedNodes.add(node)
      const outgoingEdges = g.outgoingEdgesOf(node)
      const incomingEdges = g.incomingEdgesOf(node)
      for (const { value: { capacity, flow }, target } of outgoingEdges) {
        foundEnd = foundTarget(capacity - flow, node, target, false)
        if (foundEnd) break
      }
      for (const { value: { flow }, source } of incomingEdges) {
        foundEnd = foundTarget(flow, node, source, true)
        if (foundEnd) break
      }
    }
  }
  if (!foundEnd) return undefined

  let node = sink
  let bottleneckCapacity = Number.MAX_SAFE_INTEGER
  const startKey = g.toKeyFn(source)
  const edges: {source: V, target: V, reverse: boolean}[] = []
  while (g.toKeyFn(node) !== startKey) {
    const { parent, flow, reverse } = parentMap.getValue(node)!
    if (reverse) {
      edges.push({ source: node, target: node, reverse })
    } else {
      edges.push({ source: parent, target: node, reverse })
    }
    bottleneckCapacity = Math.min(bottleneckCapacity, flow)
    node = parent
  }
  return {
    path: edges.map(({ source, target, reverse }) => {
      const { flow, capacity } = g.weightOf(source, target) as MinMaxFlowType
      return {
        source,
        target,
        capacity,
        flow: flow + (reverse ? -bottleneckCapacity : bottleneckCapacity)
      }
    }),
    bottleNeck: bottleneckCapacity
  }
}

const edmondsKarp = <V>(
  g: ReadonlyWeightedGraph<V, number>,
  source: V, sink: V): FlowResultType<V> | undefined => {
  let maxFlow = 0
  const F = mapEdges<V, number, MinMaxFlowType>(g, e => {
    return {
      capacity: e,
      flow: 0
    }
  }) as MutableWeightedGraph<V, MinMaxFlowType>
  while (true) {
    const bfsResult = bfs(F, source, sink)
    if (bfsResult == null) return undefined

    const { path, bottleNeck } = bfsResult
    if (path.length === 0) break
    for (const { source, target, flow, capacity } of path) {
      F.connect(source, target, { flow, capacity })
    }
    maxFlow += bottleNeck
  }
  return {
    flow: maxFlow,
    flowGraph: mapEdges(F, e => {
      return e.flow
    })
  }
}

type FlowResultType<V> = {
  flow: number,
  flowGraph: IReadonlyWeightedGraph<V, number>
}

export const findMaxFlow = <V> (
  g: ReadonlyWeightedGraph<V, number>,
  source: V,
  sink: V
): FlowResultType<V> | undefined => {
  if (!g.contains(source, sink)) return undefined
  else return edmondsKarp(g, source, sink)
}
