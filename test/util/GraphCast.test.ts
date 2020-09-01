import { describe, it } from 'mocha'
import { expect } from 'chai'
import { GraphBuilder, GraphUtil } from '../../index'
import { GraphType } from '../../src/types/GraphType'

describe('Test graph cast so that GraphInterface values can be safely casted' +
  ' explicitly using discriminated unions', function () {
  it('should cast to WeightedDirectedGraph', function (done) {
    let graph: any = GraphBuilder<string, number>().withoutKeyFunction().directed.weighted()
    /*
    You can check that you cannot use WeightedDirectedGraph specific properties,
    like getEdgeValue().
     */
    let castedResult = GraphUtil.castGraph(graph)
    expect(castedResult.type).equals(GraphType.WeightedDirected)
    if (castedResult.type === GraphType.WeightedDirected) {
      Object.keys(castedResult.graph).includes('getEdgeValue')
    } else {
      return done('Bad')
    }
    graph = GraphBuilder<string>().withoutKeyFunction().directed.unweighted()
    castedResult = GraphUtil.castGraph(graph)
    expect(castedResult.type).equals(GraphType.NonWeightedDirected)

    graph = GraphBuilder<string>().withoutKeyFunction().undirected.unweighted()
    castedResult = GraphUtil.castGraph(graph)
    expect(castedResult.type).equals(GraphType.NonWeightedUndirected)

    graph = GraphBuilder<string>().withoutKeyFunction().undirected.weighted()
    castedResult = GraphUtil.castGraph(graph)
    expect(castedResult.type).equals(GraphType.WeightedUndirected)
    done()
  })
})
