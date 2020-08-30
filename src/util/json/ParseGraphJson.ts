import { IGeneralNodeGraph } from '../../types/GraphInterface'
import { GraphBuilder } from '../../../index'
import { GraphJson } from './GraphJson'

export const parse = <V, E=unknown>(
  jsonString: string,
  keyFunction?: (v: V) => string
): IGeneralNodeGraph<V, E> | undefined => {
  let json: Partial<GraphJson>
  try {
    json = JSON.parse(jsonString)
  } catch {
    return
  }
  const { nodes, edges, undirected, weighted } = json

  if (!(
    nodes instanceof Array &&
    edges instanceof Array &&
    typeof undirected === 'boolean' &&
    typeof weighted === 'boolean')) {
    return undefined
  }

  const { withoutKeyFunction, withKeyFunction } = GraphBuilder<V, E>()
  const builderFunction = keyFunction != null
    ? withKeyFunction(keyFunction) : withoutKeyFunction()

  let graph: IGeneralNodeGraph<V, E>
  if (undirected && weighted) graph = builderFunction.undirected.weighted()
  else if (undirected) graph = builderFunction.undirected.unweighted()
  else if (!undirected && weighted) graph = builderFunction.directed.weighted()
  else graph = builderFunction.directed.unweighted()

  graph.insert(...nodes as V[])
  edges?.forEach(({ source, target, value }) => {
    graph.connect(source as V, target as V, value as E | undefined)
  })
  return graph
}
