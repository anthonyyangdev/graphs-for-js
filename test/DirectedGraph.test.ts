import {expect} from 'chai';
import {it, describe} from 'mocha';
import {DirectedGraph} from "../src/DirectedGraph";

describe('Test suite for a directed graph', function () {

  it('increases its count() value only when a unique value is added', function () {
    const graph = new DirectedGraph<number>()
    expect(graph.count()).equals(0)

    const added = graph.insert(1,2,3)
    expect(graph.count()).equals(added).equals(3)
    expect(graph.contains(1,2,3)).to.be.true

    expect(graph.insert(1,2,4)).equals(1)
    expect(graph.contains(1,2,3,4)).to.be.true
    expect(graph.count()).equals(4)
  });

  it('should handle object literals with string conversions', function () {
    const graph = new DirectedGraph<Record<string, number>>()
    const added = graph.insert({hi: 2, world: 5}, {what: 4, is: 2, up: 2})
    expect(graph.count()).equals(added).equals(2)
    expect(graph.contains({hi: 2, world: 5}, {what: 4, is: 2, up: 2})).to.be.true

    const source = {hi: 2, world: 5}
    const target = {what: 4, is: 2, up: 2}
    expect(graph.connect(source, target)).to.be.true
    expect(graph.connect(target, source)).to.be.true
    expect(graph.hasEdge(source, target)).to.be.true
    expect(graph.hasEdge(target, source)).to.be.true
    expect(graph.edges().length).equals(2)
  });

  it('should use the to key function to make everything have the same key', function () {
    const graph = new DirectedGraph<string>(_ => '')
    const added = graph.insert("1", "2", "graph", "3", "4", "5");
    expect(added).equals(1);
    expect(graph.nodes().size()).equals(graph.count()).equals(1);
    expect(graph.nodes().contains('1')).is.true
  });

  it('should delete all edges connected to a node if that node is deleted', function () {
    const graph = new DirectedGraph<number>()
    graph.insert(1,5,0)
    expect(graph.connect(1, 5)).to.be.true
    expect(graph.connect(5, 0)).to.be.true
    expect(graph.connect(1, 0)).to.be.true
    expect(graph.connect(5, 1)).to.be.true
    expect(graph.edges().length).equals(4)

    expect(graph.remove(5)).equals(1)
    expect(graph.contains(5)).to.be.false
    expect(graph.degreeOf(5)).equals(0)
    expect(graph.incomingEdgesOf(5).length).to.equal(0)
    expect(graph.outgoingEdgesOf(5).length).to.equal(0)
    expect(graph.hasEdge(5, 0)).to.be.false
    expect(graph.hasEdge(1, 5)).to.be.false
    expect(graph.hasEdge(1, 0)).to.be.true
    expect(graph.hasEdge(5, 1)).to.be.false
  });

});
