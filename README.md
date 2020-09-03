# graphs-for-js [![NPM version](https://badge.fury.io/js/graphs-for-js.svg)](https://npmjs.org/package/graphs-for-js) [![Build Status](https://travis-ci.org/ayang4114/graphs-for-js.svg?branch=master)](https://travis-ci.org/ayang4114/graphs-for-js) [![Coverage Status](https://coveralls.io/repos/github/ayang4114/graphs-for-js/badge.svg?branch=master)](https://coveralls.io/github/ayang4114/graphs-for-js?branch=master)

> Implementations of graph data structures for JavaScript and TypeScript
  
> Features:
> - Insert and remove nodes.
> - Connect and disconnect nodes.
> - Algorithms for graph data structures.

- [Installation](#installation)
- [Graph Class Usage](#graph-class-usage)
- [GraphUtil Usage](#graphutil-usage)
  * [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>


## Installation

```sh
$ npm install --save graphs-for-js
```

## Graph Class Usage

Import the `Graph` class to initialize a graph.

The library supports 4 types of graphs:

- Weighted, Directed graphs
    - Edges go in one-direction and can be assigned a value.
- Unweighted, Directed graphs
    - Edges go in one-direction and cannot be assigned a value.
- Weighted, Undirected graphs
    - Edges are bidirectional and can be assigned value.
- Unweighted, Undirected graphs
    - Edges are bidirectional and cannot be assigned a value.

For each of the above graph types, there are also readonly, immutable versions.

### Import the GraphBuilder

```js
// With require()
const {Graph} = require('graphs-for-js')


// With import syntax
import {Graph} from 'graphs-for-js'

```

### Key Function

Because JavaScript does not natively hash/map objects and their contents to unique values as object keys, the GraphBuilder accepts a function for mapping a node value to a string key.

If a Key Function is not given, then the default behaviors on node values are the following:
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
const weightedGraph = new Graph()
  .keyFn(i => `${i}`).directed.weighted()

const unweightedGraph = new Graph()
  .noKey().directed.unweighted()
```

### TypeScript initialization

Use the type parameters to specify the type of the nodes and of the edge values (if weighted).

```ts
const weightedGraph = new Graph<string, number>()
                          .noKey().directed.weighted()

const unweightedGraph = new Graph<string>()
                          .noKey().directed.unweighted()
```

You can also initiate a readonly graph which cannot be modified.

```ts
const weightedGraph = new Graph<number, number>()
                          .noKey().readonly.directed
                          .weighted([[1, 2, 5], [2, 3, 6]])
                          // Specify edges and implicitly the nodes

const unweightedGraph = new Graph<number>()
                          .noKey().readonly.directed
                          .unweighted([], [2, 3, 4, 5])  
                          // No edges, followed by an array of extra nodes.
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

#### Edge Value

```js
weightedGraph.weightOf(1, 4) 
// Returns the value of the edge from nodes 1 to 4, if it exists.
// If it does not exist, it returns undefined.
```

## GraphUtil Usage

The `GraphUtil` module contains some helper functions/algorithms that can be used on the graphs.

- `hasCycle(graph)`
    - Returns true if there is a cycle in the graph, false otherwise

- `findShortestPath(graph, start, end)`
    - Finds the shortest path from the node `start` to the node `end`. Returns an object with the fields `path` and `pathLength`. If there exists a path, then `path` is an array of nodes in that path in order from `start` to `end`, and `pathLength` is the length of that path, i.e. the number of edges. If a path is not found, then `path` is an empty array, and `pathLength` is `-1`.
    
- `clone(graph)`
    - Creates a new instance of a graph that contains all nodes and edges in the given `graph`. The type of graph returned is the same type of graph given, e.g. if an undirected, unweighted graph is given, then the cloned graph will also be undirected and unweighted.
    
- `topologicalSort(graph)`
    - Topologically sorts the graph. Returns `undefined` if the given graph is not a DAG. Otherwise, it returns an array of nodes in topologically sorted order.

- `toAdjacencyMatrix(graph)`
    - Converts the given `graph` into an adjacency matrix. Returns an object with 5 values:
    - ```ts
      type Result<V, E> = {
        // matrix[i][j] is true if there is an edge from node i to node j. Otherwise, it is false
        matrix: boolean[][]
      
        // valueMatrix[i][j] returns the value/weight on the edge from node i to j.
        // If there is no value or the edge does not exist, it is undefined.
        valueMatrix: (E | undefined)[][]
        
        // For each node n, nodeToIndex maps toKeyFn(n) to its index on the adjacency matrix
        nodeToIndex: Record<string, number>
        
        // Maps the index number on the adjacency matrix to the actual node value.
        indexToNode: V[]
      
        // An array of pairs, the node value and its index on the adjacency matrix.
        nodeIndexPairs: {node: V, index: number}[]
      }
      ```

- `functional` utility functions:
    - `subset(graph, nodes)`
        - Returns a new subgraph instance that contains a subset of its original nodes, where each node in that subset is in `nodes`.
        - The return type of `subset` is the same as the return type for `clone`.
    - `mapNodes(graph, callback, newKeyFn?)`
        - Creates a new graph instance whose nodes are the results of calling the given `callback` function on each node in the given `graph`.
        - The key function of the new graph is the given `newKeyFn` or the default key function if not given.
        - If 2 or more nodes result in the same key value (because of the callback function or the new key function), then those nodes are merged into one node, and each edge in those nodes are connected the newly merged node. If there was edge between two of those nodes, then the merged node will have a self loop.
    - `mapEdges(graph, callback)`
        - Creates a new graph instance whose edge values are the results of calling the given `callback` function on each edge value in the given `graph`.

- `serialize` utility functions:
    - `stringify(graph)`
        - Creates a string using the nodes and edges of the graph.
    - `parse(json)`
        - Creates a graph using a serialized representation of the graph.
    

### Examples

```js
const {Graph, GraphUtil} = require('graphs-for-js')

const graph = new Graph().noKey().directed.unweighted()

// Returns true if there exists a cycle in `graph`. Otherwise false
GraphUtil.hasCycle(graph)

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
