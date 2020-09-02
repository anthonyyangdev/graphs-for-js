import { GraphJson } from './GraphJson'
import { ReadonlyUnweightedGraph } from '../../types/GraphSystem'

export const stringify = <V, E> (
  graph: ReadonlyUnweightedGraph<V, E>
): string => {
  const nodes = graph.nodes()
  const edges = graph.edges()

  const isUndirected = graph.isUndirected
  const isWeighted = !graph.isUnweighted
  const json: GraphJson = {
    undirected: isUndirected,
    weighted: isWeighted,
    edges: edges.map(({ source, value, target }) => {
      return { source, value, target }
    }),
    nodes: nodes
  }
  return JSON.stringify(json, undefined, 2)
}
