import { describe, it } from 'mocha'
import { expect } from 'chai'
import { GraphBuilder, GraphUtil } from '../../index'
import range from '../common/range'
import { ReadonlyWeightedGraph } from '../../src/system/ReadonlyGraphs'

const repOkFlowGraph = <V> (
  g: ReadonlyWeightedGraph<V, number>,
  source: V,
  sink: V,
  flow: number
) => {
  for (const n of g.nodes()) {
    const out = g.outgoingEdgesOf(n)
    const incoming = g.incomingEdgesOf(n)
    const outFlow = out.reduce((p, { value }) => p + value, 0)
    const inFlow = incoming.reduce((p, { value }) => p + value, 0)
    if (g.toKeyFn(n) === g.toKeyFn(source)) {
      expect(outFlow).equals(flow)
    } else if (g.toKeyFn(n) === g.toKeyFn(sink)) {
      expect(inFlow).equals(flow)
    } else {
      expect(outFlow).equals(inFlow)
    }
  }
}

describe('Test suite for min max flow', function () {
  describe('Max flow', function () {
    describe('Directed', function () {
      it('should satisfy empty', function () {
        const graph = GraphBuilder<string, number>()
          .withoutKeyFunction().directed.weighted()
        const result = GraphUtil.flow.max(graph, 'A', 'G')
        expect(result).to.be.undefined
      })
      it('should satisfy unreachable', function () {
        const graph = GraphBuilder<string, number>()
          .withoutKeyFunction().directed.weighted()
        graph.insert('A', 'G')
        const result = GraphUtil.flow.max(graph, 'A', 'G')
        expect(result).to.be.undefined
      })
      it('should satisfy example [src: https://en.wikipedia.org/wiki/Edmonds%E2%80%93Karp_algorithm]', function () {
        const graph = GraphBuilder<string, number>()
          .withoutKeyFunction().directed.weighted()

        graph.insert(...range.char('A', 'G'))
        graph.connect('A', 'D', 3)
        graph.connect('D', 'F', 6)
        graph.connect('F', 'G', 9)
        graph.connect('A', 'B', 3)
        graph.connect('D', 'E', 2)
        graph.connect('E', 'B', 1)
        graph.connect('C', 'A', 3)
        graph.connect('B', 'C', 4)
        graph.connect('C', 'D', 1)
        graph.connect('C', 'E', 2)

        let result = GraphUtil.flow.max(graph, 'A', 'G')
        expect(result).is.not.undefined
        result = result!
        expect(result.flowType).equals('max')
        expect(result.flow).equals(5)
        repOkFlowGraph(result.flowGraph, 'A', 'G', result.flow)
      })
      it('should satisfy example [https://cp-algorithms.com/graph/edmonds_karp.html#integral-theorem]', function () {
        const graph = GraphBuilder<string, number>()
          .withoutKeyFunction().directed.weighted()
        graph.insert(...range.char('A', 'D'), 's', 't')
        graph.connect('s', 'A', 7)
        graph.connect('s', 'D', 4)
        graph.connect('A', 'B', 5)
        graph.connect('A', 'C', 3)
        graph.connect('D', 'A', 3)
        graph.connect('D', 'C', 2)
        graph.connect('C', 'B', 3)
        graph.connect('B', 't', 8)
        graph.connect('C', 't', 5)

        let result = GraphUtil.flow.max(graph, 's', 't')
        expect(result).is.not.undefined
        result = result!
        expect(result.flowType).equals('max')
        expect(result.flow).equals(10)
        repOkFlowGraph(result.flowGraph, 's', 't', result.flow)
      })
    })
  })
})
