import { GraphType } from './GraphType'

export interface BasicEdge<V, E=unknown> {
  source: V
  target: V
  undirected: boolean
  value?: E
}

export interface ValueEdge<V, E> extends BasicEdge<V, E> {
  value: E
}

export interface ReadonlyGraph<V, E> {

  readonly isUnweighted: boolean

  readonly isUndirected: boolean

  readonly toKeyFn: (v: V) => string

  /**
   * Returns true if all of the given nodes are in the graph.
   * @param nodes
   */
  readonly contains: (...nodes: V[]) => boolean

  /**
   * Return the degree of a node.
   * @param node
   */
  readonly degreeOf: (node: V) => number

  /**
   * Return the in-degree of a node.
   * @param node
   */
  readonly inDegreeOf: (node: V) => number

  /**
   * Return the out-degree of a node.
   * @param node
   */
  readonly outDegreeOf: (node: V) => number

  /**
   * Return an array of all nodes in the graph.
   */
  readonly nodes: () => V[]

  /**
   * Return the number of nodes in the graph.
   */
  readonly count: () => number

  /**
   * Return an array of all edges in the graph.
   */
  readonly edges: () => BasicEdge<V, E>[]

  /**
   * Return an array of all incoming edges into the given node.
   * @param node
   */
  readonly incomingEdgesOf: (node: V) => BasicEdge<V, E>[]

  /**
   * Return an array of all outgoing edges from the given node.
   * @param node
   */
  readonly outgoingEdgesOf: (node: V) => BasicEdge<V, E>[]

  /**
   * Returns an identifier corresponding to the type of the graph, i.e. if it
   * is an undirected graph or if its edges have weights.
   */
  readonly getGraphType: () => GraphType

  /**
   * Return true if an edge from source to the target exists in the graph,
   * otherwise false.
   * @param source
   * @param target
   */
  readonly hasEdge: (source: V, target: V, value?: any) => boolean
}

export interface MutableGraph<V, E> extends ReadonlyGraph<V, E> {
  /**
   * Add nodes to the graph.
   * Return the number of nodes added.
   * @param nodes
   */
  readonly insert: (...nodes: V[]) => number

  /**
   * Remove nodes from the graph.
   * Return the number of nodes removed.
   * @param nodes
   */
  readonly remove: (...nodes: V[]) => number

  /**
   * Create an edge from the source node to the target node. Return true if a new
   * edge is created, otherwise false.
   * @param source
   * @param target
   */
  readonly connect: (source: V, target: V, value?: any) => boolean

  /**
   * Remove the edge from source to target.
   * Return true if an edge is removed, otherwise false.
   * @param source
   * @param target
   */
  readonly disconnect: (source: V, target: V, value?: E) => boolean
}

export interface IReadonlyWeightedGraph<V, E> extends ReadonlyGraph<V, E> {
  readonly weightOf: (source: V, target: V) => E | undefined

  readonly getEdgeValue: (source: V, target: V) => E | undefined

  readonly hasEdge: (source: V, target: V, value?: E) => boolean

  /**
   * Return an array of all edges in the graph.
   */
  readonly edges: () => ValueEdge<V, E>[]

  /**
   * Return an array of all incoming edges into the given node.
   * @param node
   */
  readonly incomingEdgesOf: (node: V) => ValueEdge<V, E>[]

  /**
   * Return an array of all outgoing edges from the given node.
   * @param node
   */
  readonly outgoingEdgesOf: (node: V) => ValueEdge<V, E>[]
}

export interface IMutableWeightedGraph<V, E>
  extends MutableGraph<V, E>, IReadonlyWeightedGraph<V, E> {
  readonly connect: (source: V, target: V, value: E) => boolean

  readonly disconnect: (source: V, target: V, value?: E) => boolean

  readonly hasEdge: (source: V, target: V, value?: E) => boolean

  readonly edges: () => ValueEdge<V, E>[]

  readonly incomingEdgesOf: (node: V) => ValueEdge<V, E>[]

  readonly outgoingEdgesOf: (node: V) => ValueEdge<V, E>[]

}
