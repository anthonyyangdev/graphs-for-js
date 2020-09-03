import { Graph } from '../../../index'
import { GraphJson } from './GraphJson'
import { MutableGraph, MutableUnweightedGraph } from '../../types/GraphSystem'

export const parse = <V, E=unknown>(
  jsonString: string,
  keyFunction?: (v: V) => string
): MutableGraph<V, E> | undefined => {
  let json: Partial<GraphJson>
  try {
    json = JSON.parse(jsonString)
  } catch {
    return
  }
  const { nodes, edges, undirected, unweighted } = json

  if (!(
    nodes instanceof Array &&
    edges instanceof Array &&
    typeof undirected === 'boolean' &&
    typeof unweighted === 'boolean')) {
    return undefined
  }

  const { noKey, keyFn } = new Graph<V, E>()
  const builderFunction = keyFunction != null ? keyFn(keyFunction) : noKey()

  let graph: MutableUnweightedGraph<V, E>
  if (undirected && unweighted) graph = builderFunction.undirected.unweighted()
  else if (undirected) graph = builderFunction.undirected.weighted()
  else if (unweighted) graph = builderFunction.directed.unweighted()
  else graph = builderFunction.directed.weighted()

  graph.insert(...nodes as V[])
  edges?.forEach(({ source, target, value }) => {
    graph.connect(source as V, target as V, value as E | undefined)
  })
  return graph
}
