import * as HasCycle from './util/HasCycle'
import * as FindShortestPath from './util/FindShortestPath'
import * as j from './util/json'
import * as caster from './util/GetExplicitGraph'
import * as cloner from './util/GraphClone'
import * as functionalFn from './util/functional'
import * as flowAlgo from './util/MaxFlow'

export const hasCycle = HasCycle.hasCycle

export const findShortestPath = FindShortestPath.findShortestPath

export const json = {
  stringify: j.stringify,
  parse: j.parse
}

export const castGraph = caster.castExplicitly

export const clone = cloner.clone

export const functional = {
  ...functionalFn
}

export const findMaxFlow = flowAlgo.findMaxFlow
