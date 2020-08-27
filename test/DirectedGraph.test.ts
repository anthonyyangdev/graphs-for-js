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

  it('should allow self loops by default', function () {
    const graph = new DirectedGraph<number>();
    graph.insert(...new Array(10).keys())
    for (let i of new Array(10).keys()) {
      graph.connect(i, i)
    }
    const edges = graph.edges()
    expect(edges).to.have.length(10)
    for (let e of edges) {
      expect(e.target).equals(e.source)
    }
  });

  it('should not connect nonexistent nodes', function () {
    const graph = new DirectedGraph<number>();
    graph.insert(...new Array(10).keys())
    expect(graph.connect(20, 100)).to.be.false
    expect(graph.connect(20, 1)).to.be.false
    expect(graph.count()).equals(10)
    expect(graph.incomingEdgesOf(1).some(x => x.source === 20)).is.false
    expect(graph.nodes().contains(20)).is.false
    expect(graph.nodes().contains(100)).is.false
  });

  it('should cut edges', function () {
    const graph = new DirectedGraph<number>();
    graph.insert(...new Array(10).keys())
    for (let i = 0; i < 9; i++) {
      expect(graph.connect(i, i + 1)).to.be.true
    }
    expect(graph.edges().length).to.equal(9)
    expect(graph.cut(0, 1) && graph.cut(8, 9)).to.be.true
    expect(graph.edges().length).to.equal(7)
  });

  it('should return the degree of a node', function () {
    const graph = new DirectedGraph<number>();
    graph.insert(1,2,3,4,5)

    graph.connect(1,3)
    graph.connect(2,3)
    graph.connect(3,4)
    graph.connect(3,5)

    expect(graph.degreeOf(1)).equals(1)
    expect(graph.degreeOf(2)).equals(1)
    expect(graph.degreeOf(3)).equals(4)
    expect(graph.degreeOf(4)).equals(1)
    expect(graph.degreeOf(5)).equals(1)

    expect(graph.remove(3)).equals(1)
    expect(graph.degreeOf(1)).equals(0)
    expect(graph.degreeOf(2)).equals(0)
    expect(graph.degreeOf(3)).equals(0)
    expect(graph.degreeOf(4)).equals(0)
    expect(graph.degreeOf(5)).equals(0)
  });

  it('should return incoming and outgoing edges', function () {
    const graph = new DirectedGraph<number>();
    graph.insert(1,2,3,4,5)

    graph.connect(1,3)
    graph.connect(2,3)
    graph.connect(3,4)
    graph.connect(3,5)

    const incoming = graph.incomingEdgesOf(3)
    const outgoing = graph.outgoingEdgesOf(3)
    expect(incoming.length).equals(2)
    expect(outgoing.length).equals(2)

    expect(incoming.every(e => e.target === 3)).is.true
    expect(outgoing.every(e => e.source === 3)).is.true

    const nonExistentIncoming = graph.incomingEdgesOf(1000);
    const nonExistentOutgoing = graph.outgoingEdgesOf(1000);

    expect(nonExistentIncoming.length).equals(0)
    expect(nonExistentOutgoing.length).equals(0)
  });

});
