import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Graph, GraphUtil } from '../../../index'

const { stringify } = GraphUtil.json

describe('Test stringify', function () {
  const gen = new Graph<number, number>().noKey()

  it('should stringify empty graph', function () {
    let graph: any = gen.directed.unweighted()
    let json = stringify(graph).replace(/ /g, '')
    expect(json.includes('"nodes":[]')).is.true
    expect(json.includes('"edges":[]')).is.true
    expect(json.includes('"undirected":false')).is.true
    expect(json.includes('"unweighted":true')).is.true

    graph = gen.undirected.unweighted()
    json = stringify(graph).replace(/ /g, '')
    expect(json.includes('"nodes":[]')).is.true
    expect(json.includes('"edges":[]')).is.true
    expect(json.includes('"undirected":true')).is.true
    expect(json.includes('"unweighted":true')).is.true

    graph = gen.directed.weighted()
    json = stringify(graph).replace(/ /g, '')
    expect(json.includes('"nodes":[]')).is.true
    expect(json.includes('"edges":[]')).is.true
    expect(json.includes('"undirected":false')).is.true
    expect(json.includes('"unweighted":false')).is.true

    graph = gen.undirected.weighted()
    json = stringify(graph).replace(/ /g, '')
    expect(json.includes('"nodes":[]')).is.true
    expect(json.includes('"edges":[]')).is.true
    expect(json.includes('"undirected":true')).is.true
    expect(json.includes('"unweighted":false')).is.true
  })

  it('should stringify into readable graph serialize', function () {
    const graph = gen.directed.unweighted()
    graph.insert(0, 1, 2)
    graph.connect(1, 2)
    const json = stringify(graph).replace(/\s/g, '')
    expect(json.includes('"nodes":[0,1,2]')).is.true
    expect(json.includes('"edges":[{"source":1,"target":2}]')).is.true
  })

  it('should emit each edge once for undirected graph', function () {
    const graph = gen.undirected.unweighted()
    graph.insert(0, 1)
    graph.connect(0, 1)
    const json = stringify(graph).replace(/\s/g, '')
    expect(json.includes('"nodes":[0,1]'))
    expect((json.includes('"edges":[{"source":0,"target":1}]') ? 1 : 0) ^
      (json.includes('"edges":[{"source":1,"target":0}]') ? 1 : 0)).equals(1)
  })
})
