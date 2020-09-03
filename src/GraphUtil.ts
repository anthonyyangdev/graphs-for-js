import * as HasCycle from './util/HasCycle'
import * as FindShortestPath from './util/FindShortestPath'
import * as j from './util/serialize'
import * as cloner from './util/GraphClone'
import * as functionalFn from './util/functional'
import * as tpSort from './util/TopologicalSort'
import * as toMatrix from './util/ToAdjacenyMatrix'

export const hasCycle = HasCycle.hasCycle

export const findShortestPath = FindShortestPath.findShortestPath

export const serialize = {
  stringify: j.stringify,
  parse: j.parse
}

export const clone = cloner.clone

export const functional = {
  ...functionalFn
}

export const topologicalSort = tpSort.topologicalSort

export const toAdjacencyMatrix = toMatrix.toAdjacencyMatrix
