import { GraphType } from './GraphType'

export interface BasicEdge<V> {
  source: V
  target: V
  undirected: boolean
}

export interface ValueEdge<V, E> extends BasicEdge<V> {
  value: E
}

export interface GraphInterface<V> {

  toKeyFn: Readonly<(v: V) => string>

  /**
   * Add nodes to the graph. Return the number of nodes added.
   * @param nodes
   */
  insert: Readonly<(...nodes: V[]) => number>

  /**
   * Remove nodes from the graph. Return the number of nodes removed.
   * @param nodes
   */
  remove: Readonly<(...nodes: V[]) => number>

  /**
   * Returns true if all of the nodes are in the graph.
   * @param nodes
   */
  contains: Readonly<(...nodes: V[]) => boolean>

  /**
   * Return degree of a node.
   * @param node
   */
  degreeOf: Readonly<(node: V) => number>

  /**
   * Return the set of all nodes in the graph.
   */
  nodes: Readonly<() => V[]>

  /**
   * Return the number of nodes in the graph.
   */
  count: Readonly<() => number>

  /**
   * Return a set of incoming edges to the node.
   * @param node
   */
  incomingEdgesOf: Readonly<(node: V) => BasicEdge<V>[]>

  /**
   * Return a set of outgoing edges from the node.
   * @param node
   */
  outgoingEdgesOf: Readonly<(node: V) => BasicEdge<V>[]>

  /**
   * Return the set of all edges in the graph.
   */
  edges: Readonly<() => BasicEdge<V>[]>

  getGraphType: Readonly<() => GraphType>

  /**
   * Create an edge from the source node to the target node. Return true if a new
   * edge is created, otherwise false.
   * @param source
   * @param target
   */
  connect: Readonly<(source: V, target: V, value?: any) => boolean>

  /**
   * Return true if edge from source to target exists, otherwise false.
   * @param source
   * @param target
   */
  hasEdge: Readonly<(source: V, target: V, value?: any) => boolean>

  /**
   * Remove the edge from source to target. Return true if an edge is removed, otherwise false.
   * @param source
   * @param target
   */
  disconnect: Readonly<(source: V, target: V, value?: any) => boolean>
}

export interface ValueGraph<V, E> extends GraphInterface<V>{
  /**
   * Create an edge from the source node to the target node. Return true if a new
   * edge is created, otherwise false.
   * @param source
   * @param target
   */
  connect: Readonly<(source: V, target: V, value: E) => boolean>

  /**
   * Return true if edge from source to target exists, otherwise false.
   * If value is given, then the edge's value must also equal that value to return true.
   * @param source
   * @param target
   */
  hasEdge: Readonly<(source: V, target: V, value?: E) => boolean>

  /**
   * Remove the edge from source to target.
   * Return true if an edge is removed, otherwise false.
   *
   * If value is given, then the edge's value must also equal to given value to be removed.
   *
   * @param source
   * @param target
   */
  disconnect: Readonly<(source: V, target: V, value?: E) => boolean>

  /**
   * Return a set of incoming edges to the node.
   * @param node
   */
  incomingEdgesOf: Readonly<(node: V) => ValueEdge<V, E>[]>

  /**
   * Return a set of outgoing edges from the node.
   * @param node
   */
  outgoingEdgesOf: Readonly<(node: V) => ValueEdge<V, E>[]>

  /**
   * Return the set of all edges in the graph.
   */
  edges: Readonly<() => ValueEdge<V, E>[]>

  /**
   * Returns the value of an edge.
   */
  getEdgeValue: Readonly<(source: V, target: V) => E | undefined>
}
