import { GraphInterface } from '../types/GraphInterface'
import { castExplicitly } from './GetExplicitGraph'
import { GraphType } from '../types/GraphType'
import { WeightedDirectedGraph } from '../WeightedDirectedGraph'
import { DirectedGraph } from '../DirectedGraph'
import { WeightedUndirectedGraph } from '../WeightedUndirectedGraph'
import { UndirectedGraph } from '../UndirectedGraph'

export const clone = <V, E> (g: GraphInterface<V, E>) => {
  /**
   * 1) Get the graph type using casting
   * 2) Instantiate the correct graph
   * 3) Load all nodes and connect all edges, with the correct values.
   */
  let clonedGraph: GraphInterface<V, E>
  const casted = castExplicitly(g)
  switch (casted.type) {
    case GraphType.WeightedDirected:
      clonedGraph = new WeightedDirectedGraph<V, E>(g.toKeyFn); break
    case GraphType.NonWeightedDirected:
      clonedGraph = new DirectedGraph<V, E>(g.toKeyFn); break
    case GraphType.WeightedUndirected:
      clonedGraph = new WeightedUndirectedGraph<V, E>(g.toKeyFn); break
    case GraphType.NonWeightedUndirected:
      clonedGraph = new UndirectedGraph<V, E>(g.toKeyFn); break
    default: throw new Error('This case for clone has not been implemented')
  }
  const nodes = g.nodes()
  const edges = g.edges()
  clonedGraph.insert(...nodes)
  edges.forEach(({ source, target, value }) => {
    clonedGraph.connect(source, target, value)
  })
  return clonedGraph
}
