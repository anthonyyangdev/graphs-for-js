
export interface GraphJson {
  undirected: boolean;
  unweighted: boolean;
  nodes: unknown[];
  edges: {
    source: unknown;
    target: unknown;
    value: unknown;
  }[];
}
