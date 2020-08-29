import fs from 'fs'
import { GraphInterface } from '../../types/GraphInterface'
import { GraphType } from '../../types/GraphType'
import { GraphJson } from './GraphJson'

export const stringify = <V, E> (
  graph: GraphInterface<V, E>,
  outputPath: string
): Promise<void> | void => {
  if (graph === undefined) {
    return
  }
  const nodes = graph.nodes()
  const edges = graph.edges()

  const {
    NonWeightedUndirected,
    WeightedDirected,
    WeightedUndirected
  } = GraphType

  const gType = graph.getGraphType()
  const isUndirected = gType === NonWeightedUndirected || gType === WeightedUndirected
  const isWeighted = gType === WeightedDirected || gType === WeightedUndirected
  const json: GraphJson = {
    undirected: isUndirected,
    weighted: isWeighted,
    edges: edges.map(({ source, value, target }) => {
      return { source, value, target }
    }),
    nodes: nodes
  }
  const jsonString = JSON.stringify(json, undefined, 2)
  return fs.writeFileSync(outputPath, jsonString)
}
