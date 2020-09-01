import { describe, it } from 'mocha'
import { expect } from 'chai'
import { GraphBuilder, GraphUtil } from '../../../index'

const { stringify } = GraphUtil.json

describe('Test stringify', function () {
  it('should stringify empty graph', function () {
    let graph: any = GraphBuilder<number>().withoutKeyFunction().directed.unweighted()
    let json = stringify(graph).replace(/ /g, '')
    expect(json.includes('"nodes":[]')).is.true
    expect(json.includes('"edges":[]')).is.true
    expect(json.includes('"undirected":false')).is.true
    expect(json.includes('"weighted":false')).is.true

    graph = GraphBuilder<number>().withoutKeyFunction().undirected.unweighted()
    json = stringify(graph).replace(/ /g, '')
    expect(json.includes('"nodes":[]')).is.true
    expect(json.includes('"edges":[]')).is.true
    expect(json.includes('"undirected":true')).is.true
    expect(json.includes('"weighted":false')).is.true

    graph = GraphBuilder<number, number>().withoutKeyFunction().directed.weighted()
    json = stringify(graph).replace(/ /g, '')
    expect(json.includes('"nodes":[]')).is.true
    expect(json.includes('"edges":[]')).is.true
    expect(json.includes('"undirected":false')).is.true
    expect(json.includes('"weighted":true')).is.true

    graph = GraphBuilder<number, number>().withoutKeyFunction().undirected.weighted()
    json = stringify(graph).replace(/ /g, '')
    expect(json.includes('"nodes":[]')).is.true
    expect(json.includes('"edges":[]')).is.true
    expect(json.includes('"undirected":true')).is.true
    expect(json.includes('"weighted":true')).is.true
  })

  it('should stringify into readable graph json', function () {
    const graph = GraphBuilder<number, number>().withoutKeyFunction().directed.unweighted()
    graph.insert(0, 1, 2)
    graph.connect(1, 2)
    const json = stringify(graph).replace(/\s/g, '')
    expect(json.includes('"nodes":[0,1,2]')).is.true
    expect(json.includes('"edges":[{"source":1,"target":2}]')).is.true
  })

  it('should emit each edge once for undirected graph', function () {
    const graph = GraphBuilder<number, number>().withoutKeyFunction().undirected.unweighted()
    graph.insert(0, 1)
    graph.connect(0, 1)
    const json = stringify(graph).replace(/\s/g, '')
    expect(json.includes('"nodes":[0,1]'))
    expect((json.includes('"edges":[{"source":0,"target":1}]') ? 1 : 0) ^
      (json.includes('"edges":[{"source":1,"target":0}]') ? 1 : 0)).equals(1)
  })
})
