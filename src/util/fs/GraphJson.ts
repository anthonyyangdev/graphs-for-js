
export interface GraphJson {
  undirected: boolean;
  weighted: boolean;
  nodes: unknown[];
  edges: {
    source: unknown;
    target: unknown;
    value: unknown;
  }[];
}
