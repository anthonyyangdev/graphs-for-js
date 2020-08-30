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

export interface GraphInterface<V, E=unknown> {

  /**
   * The given Key Function used by the graph to determine the identity and uniqueness
   * of a node in the graph. If none is given, then the default key function follows
   * the following rules depending on the node type:
   *
   * Primitive Types:
   * - This includes number, string, boolean, symbol, null, and undefined.
   * - All primitives are converted to their string equivalents.
   * - Caution: Floats are subject to float-precision issues.
   *
   * Objects:
   * - A string representation of the object is used as the key, for which the string contains properties including
   * keys and values.
   * - For example, the object {a: 32, b: 23} is mapped as '{a:32,b:23}'
   * - If an object value is circular, then it is mapped as the value of toString(), normally '[object Object]'
   *
   * @param v
   */
  toKeyFn: (v: V) => string

  /**
   * Add nodes to the graph.
   * Return the number of nodes added.
   * @param nodes
   */
  insert: (...nodes: V[]) => number

  /**
   * Remove nodes from the graph.
   * Return the number of nodes removed.
   * @param nodes
   */
  remove: (...nodes: V[]) => number

  /**
   * Returns true if all of the given nodes are in the graph.
   * @param nodes
   */
  contains: (...nodes: V[]) => boolean

  /**
   * Return the degree of a node.
   * @param node
   */
  degreeOf: (node: V) => number

  /**
   * Return the in-degree of a node.
   * @param node
   */
  inDegreeOf: (node: V) => number

  /**
   * Return the out-degree of a node.
   * @param node
   */
  outDegreeOf: (node: V) => number

  /**
   * Return an array of all nodes in the graph.
   */
  nodes: () => V[]

  /**
   * Return the number of nodes in the graph.
   */
  count: () => number

  /**
   * Return an array of all incoming edges into the given node.
   * @param node
   */
  incomingEdgesOf: (node: V) => BasicEdge<V, E>[]

  /**
   * Return an array of all outgoing edges from the given node.
   * @param node
   */
  outgoingEdgesOf: (node: V) => BasicEdge<V, E>[]

  /**
   * Return an array of all edges in the graph.
   */
  edges: () => BasicEdge<V, E>[]

  /**
   * Returns an identifier corresponding to the type of the graph, i.e. if it
   * is an undirected graph or if its edges have weights.
   */
  getGraphType: () => GraphType

  /**
   * Create an edge from the source node to the target node. Return true if a new
   * edge is created, otherwise false.
   * @param source
   * @param target
   */
  connect: (source: V, target: V, value?: any) => boolean

  /**
   * Return true if an edge from source to the target exists in the graph,
   * otherwise false.
   * @param source
   * @param target
   */
  hasEdge: (source: V, target: V, value?: any) => boolean

  /**
   * Remove the edge from source to target.
   * Return true if an edge is removed, otherwise false.
   * @param source
   * @param target
   */
  disconnect: (source: V, target: V, value?: any) => boolean
}

export interface ValueGraph<V, E> extends GraphInterface<V, E>{

  /**
   * Create an edge from the source node to the target node with a given weight value.
   * Return true if the edges in the graph changes, i.e. a new edge is created
   * or an edge has its value changed. Return false otherwise.
   * @param source
   * @param target
   */
  connect: (source: V, target: V, value: E) => boolean

  /**
   * Return true if edge from source to target exists, otherwise false.
   * If value is given, then the value of the edge in the graph must also equal
   * that value to return true.
   * @param source
   * @param target
   */
  hasEdge: (source: V, target: V, value?: E) => boolean

  /**
   * Remove the edge from source to target.
   * Return true if an edge is removed, otherwise false.
   *
   * If a value is given, then the value of the edge in the graph must also equal
   * the given value to be removed.
   *
   * @param source
   * @param target
   */
  disconnect: (source: V, target: V, value?: E) => boolean

  /**
   * Return an array of all incoming edges into the given node.
   * @param node
   */
  incomingEdgesOf: (node: V) => ValueEdge<V, E>[]

  /**
   * Return an array of all outgoing edges from the given node.
   * @param node
   */
  outgoingEdgesOf: (node: V) => ValueEdge<V, E>[]

  /**
   * Return an array of all edges in the graph.
   */
  edges: () => ValueEdge<V, E>[]

  /**
   * Returns the value of an edge, if it exists.
   */
  getEdgeValue: (source: V, target: V) => E | undefined
}
