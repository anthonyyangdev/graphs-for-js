import { Dictionary, Queue, Set } from 'typescript-collections'
import { ReadonlyWeightedGraph } from '../system/ReadonlyGraphs'
import { IMutableWeightedGraph, IReadonlyWeightedGraph } from '../types/GraphSystem'
import { mapEdges } from './functional'
import { findShortestPath } from './FindShortestPath'
import { GraphBuilder } from '../../index'

type MinMaxFlowType = {
  capacity: number,
  flow: number
}

const bfs = <V> (
  g: IMutableWeightedGraph<V, MinMaxFlowType>,
  source: V,
  sink: V
): {path: {source: V, target: V, capacity: number, flow: number}[], bottleNeck: number } | undefined => {
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
    if (flow > 0 && !visitedNodes.contains(nextNode)) {
      parentMap.setValue(nextNode, { parent: currentNode, flow, reverse })
      if (g.toKeyFn(nextNode) === target) return true
      else bfsQueue.enqueue(nextNode)
    }
    return false
  }

  while (!bfsQueue.isEmpty() && !foundEnd) {
    const node = bfsQueue.dequeue() as V
    visitedNodes.add(node)
    const outgoingEdges = g.outgoingEdgesOf(node)
    const incomingEdges = g.incomingEdgesOf(node)
    for (const { value: { capacity, flow }, target } of outgoingEdges) {
      foundEnd = foundTarget(capacity - flow, node, target, false)
      if (foundEnd) break
    }
    if (foundEnd) break
    for (const { value: { flow }, source } of incomingEdges) {
      foundEnd = foundTarget(flow, node, source, true)
      if (foundEnd) break
    }
  }
  if (!foundEnd) return { path: [], bottleNeck: 0 }

  let node = sink
  let bottleneckCapacity = Number.MAX_SAFE_INTEGER
  const startKey = g.toKeyFn(source)
  const edges: {source: V, target: V, reverse: boolean}[] = []
  while (g.toKeyFn(node) !== startKey) {
    const { parent, flow, reverse } = parentMap.getValue(node)!
    if (reverse) {
      edges.push({ source: node, target: parent, reverse })
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

const convertGraph = <V> (
  g: ReadonlyWeightedGraph<V, number>
): IMutableWeightedGraph<V, MinMaxFlowType> => {
  if (g.isUndirected) {
    const edges = g.edges()
    const nodes = g.nodes()
    const directedGraph = GraphBuilder<V, MinMaxFlowType>()
      .withKeyFunction(g.toKeyFn).directed.weighted()
    directedGraph.insert(...nodes)
    edges.forEach(({ source, target, value }) => {
      directedGraph.connect(source, target, {
        capacity: value, flow: 0
      })
      directedGraph.connect(target, source, {
        capacity: value, flow: 0
      })
    })
    return directedGraph
  } else {
    return mapEdges<V, number, MinMaxFlowType>(g, e => {
      return {
        capacity: e,
        flow: 0
      }
    })
  }
}

const edmondsKarp = <V>(
  g: ReadonlyWeightedGraph<V, number>,
  source: V, sink: V): FlowResultType<V> | undefined => {
  let maxFlow = 0
  const F = convertGraph(g)
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

/**
 * Returns undefined if a flow cannot be computed. Otherwise, it returns an object
 * with the flow and the residual graph.
 * @param g
 * @param source
 * @param sink
 */
export const findMaxFlow = <V> (
  g: ReadonlyWeightedGraph<V, number>,
  source: V,
  sink: V
): FlowResultType<V> | undefined => {
  if (
    !g.contains(source, sink) ||
    g.edges().some(e => !Number.isInteger(e.value)) ||
    findShortestPath(g, source, sink).pathSize === -1) { // Because of fpa
    return undefined
  } else {
    return edmondsKarp(g, source, sink)
  }
}
