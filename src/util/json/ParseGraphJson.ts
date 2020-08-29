import fs from 'fs'
import { GraphInterface } from '../../types/GraphInterface'
import { GraphBuilder } from '../../../index'
import { GraphJson } from './GraphJson'

export const parse = <V, E>(
  inputPath: string,
  keyFunction?: (v: V) => string
): GraphInterface<V, E> => {
  const jsonString = fs.readFileSync(inputPath).toString()
  const json: GraphJson = JSON.parse(jsonString)
  const { nodes, edges, undirected, weighted } = json
  const { withoutKeyFunction, withKeyFunction } = GraphBuilder<V, E>()
  const builderFunction = keyFunction != null
    ? withKeyFunction(keyFunction) : withoutKeyFunction()

  let graph: GraphInterface<V, E>
  if (undirected && weighted) graph = builderFunction.directed.weighted()
  else if (undirected) graph = builderFunction.directed.weighted()
  else if (!undirected && weighted) graph = builderFunction.undirected.weighted()
  else graph = builderFunction.undirected.unweighted()

  graph.insert(...nodes as V[])
  edges.forEach(({ source, target, value }) => {
    graph.connect(source as V, target as V, value as E | undefined)
  })
  return graph
}
