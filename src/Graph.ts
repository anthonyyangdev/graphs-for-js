import {Set} from "typescript-collections";

export interface Graph<V, E> {
  insert: (...nodes: V[]) => number
  remove: (...nodes: V[]) => number
  contains: (...nodes: V[]) => boolean

  connect: (source: V, target: V) => boolean
  hasEdge: (source: V, target: V) => boolean
  cut: (source: V, target: V) => boolean

  degreeOf: (node: V) => number
  incomingEdgesOf: (node: V) => Set<E>
  outgoingEdgesOf: (node: V) => Set<E>

  edges: () => Set<E>
  nodes: () => Set<V>

  count: () => number
}
