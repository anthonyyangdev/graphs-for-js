import {Set} from "typescript-collections";

export interface Graph<V, E> {
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
   * Return degree of a node.
   * @param node
   */
  degreeOf: (node: V) => number

  /**
   * Return a set of incoming edges to the node.
   * @param node
   */
  incomingEdgesOf: (node: V) => E[]

  /**
   * Return a set of outgoing edges from the node.
   * @param node
   */
  outgoingEdgesOf: (node: V) => E[]

  /**
   * Return the set of all edges in the graph.
   */
  edges: () => E[]

  /**
   * Return the set of all nodes in the graph.
   */
  nodes: () => Set<V>

  /**
   * Return the number of nodes in the graph.
   */
  count: () => number
}
