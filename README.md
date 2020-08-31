# graphs-for-js [![NPM version](https://badge.fury.io/js/graphs-for-js.svg)](https://npmjs.org/package/graphs-for-js) [![Build Status](https://travis-ci.org/ayang4114/graphs-for-js.svg?branch=master)](https://travis-ci.org/ayang4114/graphs-for-js)

> Implementations of graph data structures for JavaScript and TypeScript
  
> Features:
> - Insert and remove nodes.
> - Connect and disconnect nodes.
> - Algorithms for graph data structures.


- [Installation](#installation)
- [GraphBuilder Usage](#graphbuilder-usage)
  * [Import the GraphBuilder](#import-the-graphbuilder)
  * [Key Function](#key-function)
  * [JavaScript initialization](#javascript-initialization)
  * [TypeScript initialization](#typescript-initialization)
  * [Using the Graph](#using-the-graph)
    + [Insert nodes](#insert-nodes)
    + [Removing nodes](#removing-nodes)
    + [Number of nodes](#number-of-nodes)
    + [Forming edges](#forming-edges)
    + [Removing edges](#removing-edges)
    + [Get all of the nodes and edges in the graph](#get-all-of-the-nodes-and-edges-in-the-graph)
    + [Incoming and Outgoing edges](#incoming-and-outgoing-edges)
    + [Degree of Edge](#degree-of-edge)
    + [Existence Methods](#existence-methods)
- [GraphUtil Usage](#graphutil-usage)
  * [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>


## Installation

```sh
$ npm install --save graphs-for-js
```

## GraphBuilder Usage

Import the `GraphBuilder` to build and initialize a graph.

The library supports 4 types of graphs:

- Weighted, Directed graphs
    - Edges go in one-direction and can be assigned a value.
- Unweighted, Directed graphs
    - Edges go in one-direction and cannot be assigned a value.
- Weighted, Undirected graphs
    - Edges are bidirectional and can be assigned value.
- Unweighted, Undirected graphs
    - Edges are bidirectional and cannot be assigned a value.

### Import the GraphBuilder

```js
// With require()
const {GraphBuilder} = require('graphs-for-js')


// With import syntax
import {GraphBuilder} from 'graphs-for-js'

```

### Key Function

Because JavaScript does not directly hash/map objects and their contents to unique values, the GraphBuilder accepts a function for mapping a node value to a string key.

If a Key Function is not given, then the default behaviors are the following:
- Primitive Types
    - This includes number, string, boolean, symbol, null, and undefined.
    - All primitives are converted to their string equivalents.
    - **Caution**: Floats are subject to float-precision issues.
- Objects
    - A string representation of the object is used as the key, for which the string contains properties including keys and values.
    - For example, the object `{a: 32, b: 23}` is mapped as `'{a:32,b:23}'`
    - If an object value is circular, then it is mapped as the value of `toString()`, normally `'[object Object]'`

### JavaScript initialization

```js
const weightedGraph = GraphBuilder()
                      .withKeyFunction(i => `${i}`)
                      .directed.weighted()  
const unweightedGraph = GraphBuilder()
                        .withoutKeyFunction()
                        .directed.unweighted()
```

### TypeScript initialization

Use type parameters to specify the type of the nodes and of the edge values (if weighted).

```ts
const weightedGraph = GraphBuilder<string, number>()
                          .withoutKeyFunction()
                          .directed.weighted()
const unweightedGraph = GraphBuilder<string>()
                          .withoutKeyFunction()
                          .directed.unweighted()
```

### Using the Graph

For the following examples, assume the nodes of `graph` are numbers. 

The examples show the differences among each type of graph when necessary.

#### Insert nodes

```js
graph.insert(0)  // Insert a single node
graph.insert(1, 2, 3) // Insert multiple nodes
const result = graph.insert(...[4,5,6,7]) // Use spread syntax for array inputs

console.log(result) // The number of nodes inserted
```

#### Removing nodes
```js
graph.remove(0)  // Remove a single node
graph.remove(1, 2, 3) // Removes multiple nodes
const result = graph.remove(...[4,5,6,7]) // Use spread syntax for array inputs

console.log(result) // The number of nodes removed
```

#### Number of nodes

```js
graph.count()
```

#### Forming edges

```js
unweightedGraph.connect(1, 2) // Creates an edge from node 1 to node 2

weightedGraph.connect(1, 2, 0.5) // Creates an edge from node 1 to node 2 with weight 0.5
```

#### Removing edges

```js
unweightedGraph.disconnect(1, 2) // Removes the edge from node 1 to node 2

weightedGraph.disconnect(1, 2) // Removes the edge from node 1 to node 2
weightedGraph.disconnect(1, 2, 0.5) // Removes the edge from node 1 to node 2 only if the weight of that edge is 0.5

undirectedGraph.connect(1, 2)
undirectedGraph.disconnect(2, 1) // Will remove the edge from node 1 to node 2 in a unweighted graph.
```

#### Get all of the nodes and edges in the graph

```ts
graph.nodes()  // Returns an array of node values
graph.edges()  // Returns an array of edges

/*
type Edge<V, E> = {
  source: V,
  target: V,
  value: E,
  undirected: boolean
}
*/
```

#### Incoming and Outgoing edges

```js
graph.outgoingEdgesOf(2)  // Returns an array of edges whose source nodes are node 2
graph.incomingEdgesOf(2)  // Returns an array of edges whose target nodes are node 2
```

#### Degree of Edge

```js
graph.degreeOf(2) // Degree of node 2
graph.inDegreeOf(2) // In-Degree of node 2
graph.outDegreeOf(2) // Out-Degree of node 2
```

#### Existence Methods

```js
graph.contains(1)   // Contains node 1
graph.contains(1, 2, 3)  // Contains all three nodes



unweightedGraph.hasEdge(1, 2)  // Has edge from node 1 to node 2

weightedGraph.hasEdge(1, 2) // Has edge from node 1 to node 2
weightedGraph.hasEdge(1, 2, 0.5) // Returns true if there is an edge from node 1 to node 2 AND edge value is 0.5

undirectedGraph.hasEdge(x, y) === undirectedGraph.hasEdge(y, x)  // true
```

## GraphUtil Usage

Some helper functions are included in the `GraphUtil` import.

### Examples

```js
const {GraphBuilder, GraphUtil} = require('graphs-for-js')

const graph = GraphBuilder().withoutKeyFunction().directed.unweighted()
GraphUtil.hasCycle(graph) // Returns true if there exists a cycle in `graph`. Otherwise false

/*
  Finds the shortest path from the start node to the end node.
  Where V is the type of the node
  return type: {
    path: Array<V>  // The nodes in the discovered path. If no path is found, then this array is empty.
    pathLength: number // The number of edges in the discovered path. If no path is found, then this is -1.
  }
*/
GraphUtil.findShortestPath(graph, 1, 2)
```

## Contributing

Feel free to contribute by adding changes to the graph implementation or by writing implementations for graph algorithms in `GraphUtil`! You can also add suggestions or issues [here]()

If you'd like to make changes to the graph implementation or for `GraphUtil`:

1) Fork this repository

2) Create a feature branch

3) Make changes 🛠

4) Make a PR to merge into this repo

## License

ISC © [Anthony Yang](LICENSE.md)
