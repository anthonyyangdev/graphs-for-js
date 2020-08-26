import {expect} from 'chai';
import {it, describe} from 'mocha';
import {DirectedGraph} from "../src/DirectedGraph";


describe('Test suite for a directed graph', function () {

  it('increases its count() value only when a unique value is added', function () {
    const graph = new DirectedGraph<number>()
    expect(graph.count()).equals(0)
    graph.insert(1,2,3)
    expect(graph.count()).equals(3)
    graph.insert(1,2,4)
    expect(graph.count()).equals(4)
  });

  it('should handle object literals with string conversions', function () {
    const graph = new DirectedGraph<Record<string, number>>()
    graph.insert({hi: 2, world: 5})
    graph.insert({what: 4, is: 2, up: 2})
    expect(graph.count()).equals(2)
    expect(graph.contains({hi: 2, world: 5})).to.be.true
    expect(graph.contains({what: 4, is: 2, up: 2})).to.be.true
  });

});
