import { Set } from 'typescript-collections'

export interface BasicEdge<V> {
  source: V
  target: V
}

export interface ValueEdge<V, E> extends BasicEdge<V> {
  value: E
}

export interface GraphInterface<V> {
  /**
   * Add nodes to the graph. Return the number of nodes added.
   * @param nodes
   */
  insert: (...nodes: V[]) => number

  /**
   * Remove nodes from the graph. Return the number of nodes removed.
   * @param nodes
   */
  remove: (...nodes: V[]) => number

  /**
   * Returns true if all of the nodes are in the graph.
   * @param nodes
   */
  contains: (...nodes: V[]) => boolean

  /**
   * Return degree of a node.
   * @param node
   */
  degreeOf: (node: V) => number

  /**
   * Return the set of all nodes in the graph.
   */
  nodes: () => Set<V>

  /**
   * Return the number of nodes in the graph.
   */
  count: () => number
}

export interface BasicGraph<V> extends GraphInterface<V> {
  /**
   * Create an edge from the source node to the target node. Return true if a new
   * edge is created, otherwise false.
   * @param source
   * @param target
   */
  connect: (source: V, target: V) => boolean

  /**
   * Return true if edge from source to target exists, otherwise false.
   * @param source
   * @param target
   */
  hasEdge: (source: V, target: V) => boolean

  /**
   * Remove the edge from source to target. Return true if an edge is removed, otherwise false.
   * @param source
   * @param target
   */
  cut: (source: V, target: V) => boolean

  /**
   * Return a set of incoming edges to the node.
   * @param node
   */
  incomingEdgesOf: (node: V) => BasicEdge<V>[]

  /**
   * Return a set of outgoing edges from the node.
   * @param node
   */
  outgoingEdgesOf: (node: V) => BasicEdge<V>[]

  /**
   * Return the set of all edges in the graph.
   */
  edges: () => BasicEdge<V>[]
}

export interface ValueGraph<V, E> extends GraphInterface<V>{
  /**
   * Create an edge from the source node to the target node. Return true if a new
   * edge is created, otherwise false.
   * @param source
   * @param target
   */
  connect: (source: V, target: V, value: E) => boolean

  /**
   * Return true if edge from source to target exists, otherwise false.
   * @param source
   * @param target
   */
  hasEdge: (source: V, target: V, value: E) => boolean

  /**
   * Remove the edge from source to target. Return true if an edge is removed, otherwise false.
   * @param source
   * @param target
   */
  cut: (source: V, target: V, value: E) => boolean

  /**
   * Return a set of incoming edges to the node.
   * @param node
   */
  incomingEdgesOf: (node: V) => ValueEdge<V, E>[]

  /**
   * Return a set of outgoing edges from the node.
   * @param node
   */
  outgoingEdgesOf: (node: V) => ValueEdge<V, E>[]

  /**
   * Return the set of all edges in the graph.
   */
  edges: () => ValueEdge<V, E>[]
}
