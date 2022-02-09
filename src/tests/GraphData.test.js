import { Graph } from '../data/GraphData'

test("Graph.constructor: parses JSON into data field", () => {
    const json = `{"x": "1234", "y": 1234, "z": [1, 2, 3]}`;
    let g = new Graph(json);
    expect(g.data.x).toEqual("1234");
    expect(g.data.y).toEqual(1234);
    expect(g.data.z).toEqual([1, 2, 3]);
});

test("Graph.constructor: adds required fields but does not overwrite them", () => {
    const json = `{"nodes": [{"idx": 0, "name": "Test"}]}`;
    let g = new Graph(json);
    expect(g.data.nodes[0]).toEqual({ idx: 0, name: "Test" });
    expect(g.data.edges).toEqual([]);
});

test("Graph.addNode: adds new nodes to end of list and update idx", () => {
    let g = new Graph("{}");

    let node1 = { idx: 1234, name: "asdf" };
    g.addNode(node1);
    expect(node1.idx).toEqual(0);
    expect(g.data.nodes[0]).toEqual(node1);

    node1 = null;
    expect(g.data.nodes[0].name).toEqual("asdf");

    let node2 = { idx: 1234, name: "1234" };
    g.addNode(node2);
    expect(node2.idx).toEqual(1);
    expect(g.data.nodes[1]).toEqual(node2);

    node2 = null;
    expect(g.data.nodes[1].name).toEqual("1234");
});

test("Graph.addEdge: adds new edges to end of list and update idx", () => {
    let g = new Graph("{}");

    let edge1 = { idx: 1234, name: "asdf", source: 0, target: 1 };
    g.addEdge(edge1);
    expect(g.data.edges[0].name).toEqual("asdf");
    expect(g.data.edges[0].source).toEqual(0);
    expect(g.data.edges[0].target).toEqual(1);
    expect(edge1.idx).toEqual(0);

    let edge2 = { idx: 1234, name: "1234", source: 0, target: 0 };
    g.addEdge(edge2);
    expect(g.data.edges[1].name).toEqual("1234");
    expect(g.data.edges[1].source).toEqual(0);
    expect(g.data.edges[1].target).toEqual(0);
    expect(edge2.idx).toEqual(1);
});

test("Graph.removeEdgeIdx: wrong edge idx", () => {
    let g = new Graph("{}");
    let edge1 = { idx: 123, source: 0, target: 1 };
    let edge2 = { idx: 123, source: 1, target: 2 };

    g.addEdge(edge1);
    g.addEdge(edge2);

    g.removeEdgeIdx(4);

    expect(edge1.idx).toBeDefined();
    expect(edge2.idx).toBeDefined();
    expect(g.data.edges[0]).toEqual(edge1);
    expect(g.data.edges[1]).toEqual(edge2);
});

test("Graph.removeEdgeIdx: splices edge from array", () => {
    let g = new Graph("{}");
    let edge1 = { idx: 123, source: 0, target: 1 };
    let edge2 = { idx: 123, source: 1, target: 2 };
    let edge3 = { idx: 123, source: 2, target: 3 };
    let edge4 = { idx: 123, source: 3, target: 0 };

    g.addEdge(edge1);
    g.addEdge(edge2);
    g.addEdge(edge3);
    g.addEdge(edge4);

    g.removeEdgeIdx(2);

    expect(edge1.idx).toBeDefined();
    expect(edge2.idx).toBeDefined();
    expect(edge3.idx).toBeUndefined();
    expect(edge4.idx).toBeDefined();

    expect(g.data.edges[0]).toEqual(edge1);
    expect(g.data.edges[1]).toEqual(edge2);
    expect(g.data.edges[2]).toEqual(edge4);
    expect(g.data.edges[3]).toEqual(undefined);

    g.removeEdgeIdx(0);

    expect(edge1.idx).toBeUndefined();
    expect(edge2.idx).toBeDefined();
    expect(edge3.idx).toBeUndefined();
    expect(edge4.idx).toBeDefined();

    expect(g.data.edges[0]).toEqual(edge2);
    expect(g.data.edges[1]).toEqual(edge4);
    expect(g.data.edges[2]).toEqual(undefined);
});

test("Graph.removeNodeIdx: wrong node idx", () => {
    let g = new Graph("{}");
    let node1 = { idx: 123, name: "nodeOne" };
    g.addNode(node1);

    g.removeNodeIdx(1);

    expect(node1.idx).toBeDefined();
    expect(node1.name).toEqual("nodeOne");
});

test("Graph.removeNodeIdx: node with edges", () => {
    let g = new Graph("{}");
    let node1 = { idx: 123, name: "nodeOne" };
    let node2 = { idx: 123, name: "nodeTwo" };
    let node3 = { idx: 123, name: "nodeThree" };
    let edge1 = { idx: 123, source: 0, target: 2 };
    let edge2 = { idx: 123, source: 1, target: 2 };
    let edge3 = { idx: 123, source: 2, target: 1 };
    let edge4 = { idx: 123, source: 2, target: 2 };
    let edge5 = { idx: 123, source: 2, target: 0 };

    g.addNode(node1);
    g.addNode(node2);
    g.addNode(node3);
    g.addEdge(edge1);
    g.addEdge(edge2);
    g.addEdge(edge3);
    g.addEdge(edge4);
    g.addEdge(edge5);

    g.removeNodeIdx(1);

    expect(node1.idx).toBeDefined();
    expect(node2.idx).toBeUndefined();
    expect(node3.idx).toBeDefined();

    expect(g.data.nodes[0]).toEqual(node1);
    expect(g.data.nodes[1]).toEqual(node3);
    expect(g.data.nodes[2]).toEqual(undefined);

    expect(edge1.idx).toBeDefined();
    expect(edge2.idx).toBeUndefined();
    expect(edge3.idx).toBeUndefined();
    expect(edge4.idx).toBeDefined();
    expect(edge5.idx).toBeDefined();

    expect(edge1.source).toEqual(0);
    expect(edge1.target).toEqual(1);
    expect(edge4.source).toEqual(1);
    expect(edge4.target).toEqual(1);
    expect(edge5.source).toEqual(1);
    expect(edge5.target).toEqual(0);
});