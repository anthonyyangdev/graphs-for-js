import { describe, it } from 'mocha'
import { expect } from 'chai'
import { AbstractMutableDirectedGraph } from '../src/mutable/AbstractMutableDirectedGraph'
import { DirectedGraph } from '../src/mutable/DirectedGraphs'

/**
 * Creates a directed graph.
 */
function makeGraph<V> (): AbstractMutableDirectedGraph<V> {
  return new DirectedGraph<V>()
}

describe('Different primitive types values as nodes should be unique', function () {
  it('should distinguish integer numbers', function () {
    const numberGraph = makeGraph<number>()
    numberGraph.insert(1, 2, 3, 4, 5, 6)
    expect(numberGraph.count()).equals(6)
    numberGraph.insert(Number.MAX_SAFE_INTEGER)
    numberGraph.insert(Number.MIN_SAFE_INTEGER)
    expect(numberGraph.count()).equals(8)
    expect(numberGraph.insert(1, 2, 3, 4, 5, 6, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)).equals(0)
    let count = numberGraph.count()
    for (const i of [1, 2, 3, 4, 5, 6, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]) {
      expect(numberGraph.remove(i)).equals(1)
      count--
      expect(count).equals(numberGraph.count())
    }
  })

  it('should distinguish string values', function () {
    const stringGraph = makeGraph<string>()
    stringGraph.insert('a', 'b', 'c', 'd', 'e')
    expect(stringGraph.count()).equals(5)
    expect(stringGraph.insert('a', 'b', 'c', 'd', 'e')).equals(0)
    let count = stringGraph.count()
    for (const i of ['a', 'b', 'c', 'd', 'e']) {
      expect(stringGraph.remove(i)).equals(1)
      count--
      expect(count).equals(stringGraph.count())
    }
  })

  it('should distinguish boolean values', function () {
    const booleanGraph = makeGraph<boolean>()
    expect(booleanGraph.insert(true, false)).equals(2)
    expect(booleanGraph.count()).equals(2)
    expect(booleanGraph.insert(true, false)).equals(0)
    let count = booleanGraph.count()
    for (const i of [true, false]) {
      expect(booleanGraph.remove(i)).equals(1)
      count--
      expect(count).equals(booleanGraph.count())
    }
  })

  it('should tell null and undefined apart', function () {
    const graph = makeGraph<null | undefined>()
    expect(graph.insert(undefined, null)).equals(2)
    expect(graph.count()).equals(2)
    expect(graph.insert(undefined, null)).equals(0)
    let count = graph.count()
    for (const i of [null, undefined]) {
      expect(graph.remove(i)).equals(1)
      count--
      expect(count).equals(graph.count())
    }
  })

  it('should tell apart symbols of different descriptions', function () {
    const graph = makeGraph<symbol>()
    expect(graph.insert(Symbol('1'), Symbol('2'))).equals(2)
    expect(graph.count()).equals(2)
    expect(graph.insert(Symbol('1'), Symbol('2'))).equals(0)
    let count = graph.count()
    for (const i of [Symbol('1'), Symbol('2')]) {
      expect(graph.remove(i)).equals(1)
      count--
      expect(count).equals(graph.count())
    }
  })
})
