import { describe, it } from 'mocha'
import { expect } from 'chai'
import { IGeneralNodeGraph } from '../../src/types/GraphInterface'
import { WeightedDirectedGraph } from '../../src/WeightedDirectedGraph'
import { GraphUtil } from '../../index'
import { GraphType } from '../../src/types/GraphType'
import { DirectedGraph } from '../../src/DirectedGraph'
import { UndirectedGraph } from '../../src/UndirectedGraph'
import { WeightedUndirectedGraph } from '../../src/WeightedUndirectedGraph'

describe('Test graph cast so that GraphInterface values can be safely casted' +
  ' explicitly using discriminated unions', function () {
  it('should cast to WeightedDirectedGraph', function (done) {
    let graph = new WeightedDirectedGraph<string, number>() as IGeneralNodeGraph<string>
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
    graph = new DirectedGraph<string>() as IGeneralNodeGraph<string>
    castedResult = GraphUtil.castGraph(graph)
    expect(castedResult.type).equals(GraphType.NonWeightedDirected)

    graph = new UndirectedGraph<string>() as IGeneralNodeGraph<string>
    castedResult = GraphUtil.castGraph(graph)
    expect(castedResult.type).equals(GraphType.NonWeightedUndirected)

    graph = new WeightedUndirectedGraph<string, number>() as IGeneralNodeGraph<string>
    castedResult = GraphUtil.castGraph(graph)
    expect(castedResult.type).equals(GraphType.WeightedUndirected)
    done()
  })
})
