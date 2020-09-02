import { describe, it } from 'mocha'
import { GraphUtil } from '../../../index'
import { expect } from 'chai'
import { GraphType } from '../../../src/types/GraphType'
import { MutableWeightedGraph } from '../../../src/types/GraphSystem'

const { parse } = GraphUtil.json

describe('Parse graphs from json', function () {
  it('should accept key function', function () {
    const json = `
    {
      "undirected": false,
      "weighted": false,
      "nodes": [1,2,3],
      "edges": []
    }`
    let graph = parse<number>(json, n => '')
    expect(graph).is.not.undefined
    graph = graph!
    expect(graph.count()).equals(graph.nodes().length).equals(1)
    expect(graph.contains(1))
    expect(graph.edges().length).equals(0)
  })

  it('should fail to parse improper json', function () {
    let json = `
    {
      "undirected": "hello",
      "weighted": false,
      "nodes": [1, 4, 5],
      "edges": [{ "source": 1, "not_target": 4 }]
    }`
    expect(parse(json)).is.undefined

    json = `
    {
      "undirected": false,
      "weighted": "not boolean",
      "nodes": [1, 4, 5],
      "edges": [{ "source": 1, "not_target": 4 }]
    }`
    expect(parse(json)).is.undefined

    json = `
    {
      "undirected": false,
      "weighted": false,
      "nodes": "not an array",
      "edges": [{ "source": 1, "not_target": 4 }]
    }`
    expect(parse(json)).is.undefined

    json = `
    {
      "undirected": false,
      "weighted": false,
      "nodes": [1],
      "edges": "not an array" 
    }`
    expect(parse(json)).is.undefined
  })
  it('should parse directed, unweighted graph json', function () {
    const json = `{
      "undirected": false,
      "weighted": false,
      "nodes": [1, 2],
      "edges": [{ "source": 1, "target": 2 }]
    }`
    let graph = parse<number>(json)
    expect(graph).is.not.undefined
    graph = graph!
    expect(graph.contains(1, 2)).is.true
    expect(graph.count()).equals(graph.nodes().length).equals(2)
    expect(graph.hasEdge(1, 2)).is.true
    expect(graph.hasEdge(2, 1)).is.false
    expect(graph.edges().length).equals(1)
  })
  it('should parse directed, weighted graph json', function () {
    const json = `{
      "undirected": false,
      "weighted": true,
      "nodes": ["number", "word"],
      "edges": [
        { "source": "number", "target": "word", "value": 10 },
        { "source": "word", "target": "number", "value": 5 }
      ]
    }`
    let graph = parse<string, number>(json)
    expect(graph).is.not.undefined
    graph = graph!
    expect(graph.contains('number', 'word')).is.true
    expect(graph.count()).equals(graph.nodes().length).equals(2)
    expect(graph.edges().length).equals(2)
    expect(graph.hasEdge('number', 'word', 10)).is.true
    expect(graph.hasEdge('word', 'number', 5)).is.true
  })

  it('should parse undirected and weighted graph json', function () {
    const json = `{
      "undirected": true,
      "weighted": true,
      "nodes": [1,2],
      "edges": [{
        "source": 1,
        "target": 2,
        "value": "hello"
      }]
    }`
    let graph = parse<number, string>(json)
    expect(graph).is.not.undefined
    graph = graph!
    expect(graph.getGraphType()).equals(GraphType.WeightedUndirected)
    expect(graph.nodes().length).equals(graph.count()).equals(2)
    expect(graph.contains(1, 2)).is.true
    expect(graph.hasEdge(1, 2)).is.true
    const weightedUndirectedGraph = graph as MutableWeightedGraph<number, string>
    expect(weightedUndirectedGraph.degreeOf(1)).equals(1)
    expect(weightedUndirectedGraph.weightOf(1, 2)).equals('hello')
  })
  it('should parse undirected and unweighted graph json', function () {
    const json = `{
      "undirected": true,
      "weighted": false,
      "nodes": [1, 2, 3, 4],
      "edges": [{
        "source": 1,
        "target": 2
      }, {
        "source": 2,
        "target": 3
      }, {
        "source": 3,
        "target": 4
      }]
    }`
    let graph = parse<number>(json)
    expect(graph).is.not.undefined
    graph = graph!
    expect(graph.getGraphType()).equals(GraphType.NonWeightedUndirected)
    expect(graph.count()).equals(graph.nodes().length).equals(4)
    expect(graph.edges().length).equals(3)
    expect(graph.contains(1, 2, 3, 4)).is.true
    expect(graph.hasEdge(1, 2)).is.true
    expect(graph.hasEdge(2, 1)).is.true
    expect(graph.hasEdge(2, 3)).is.true
    expect(graph.hasEdge(3, 2)).is.true
    expect(graph.hasEdge(3, 4)).is.true
    expect(graph.hasEdge(4, 3)).is.true
  })
})
