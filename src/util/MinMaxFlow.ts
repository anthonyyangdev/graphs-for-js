import { IReadonlyWeightedGraph } from '../types/GraphInterface'
import { clone } from './GraphClone'

/*
inputs
    C[n x n] : Capacity Matrix
    E[n x n] : Adjacency Matrix
    s : source
    t : sink
output
    f : maximum flow
Edmonds-Karp:
    f = 0             // Flow is initially 0
    F = [n x n]       // residual capacity array, capacity remaining
    while true:
        m, P = Breadth-First-Search(C, E, s, t, F)
            // Search for the next augmenting path
            // m is the residual capacity
            // P is the parent matrix
        if m = 0:
            break
        f = f + m
        v = t
        while v != s:
            u = P[v]
            F[u, v] = F[u, v] - m       //This is reducing the residual capacity of the augmenting path
            F[v, u] = F[v, u] + m        //This is increasing the residual capacity of the reverse edges
            v = u
    return f
 */
const bfs = (c: any, e: any, s: any, t: any, f: any): [number, number[]] => {
  console.log(c, e, s, t, f)
  return [2, [3]]
}

const edmondsKarp = <V>(
  capacityMatrix: number[][],
  g: IReadonlyWeightedGraph<number, number | bigint>,
  s: V, t: V) => {
  let flow = 0
  const F = clone(g)
  while (true) {
    const [m, P] = bfs(capacityMatrix, g, s, t, F)
    if (m === 0) break
    flow += m
    const v = t
    while (v !== s) {
      const u = P[v as unknown as number]
      F[]
    }
  }
}

const findMaxFlow = <V> (g: IReadonlyWeightedGraph<number, number | bigint>) => {
  const v = g.getEdgeValue(1, 2)
  if (v === undefined) {
  } else if (typeof v === 'bigint') {
    const sum = v / v
  } else {
  }
}
