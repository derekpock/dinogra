import {defaultObjectValue} from '../Utilities';

// Nodes
//  x, y, width, height
//  name, shape, rounding

// Edges
//  source, target
//  name

export class Graph {
    constructor(json = "{}") {
        this.data = JSON.parse(json);
        defaultObjectValue(this.data, "nodes", []);
        defaultObjectValue(this.data, "edges", []);
        this.nodes = this.data.nodes;
        this.edges = this.data.edges;
    }

    addNode(node) {
        const idx = this.data.nodes.push(node) - 1;
        this.data.nodes[idx].idx = idx;
    }

    addEdge(edge) {
        const idx = this.data.edges.push(edge) - 1;
        this.data.edges[idx].idx = idx;
    }

    removeNodeIdx(idx) {
        const removedNodes = this.data.nodes.splice(idx, 1);
        if (removedNodes[0]) {
            removedNodes[0].idx = undefined;
        } else {
            console.error("Tried to remove non-present node idx", idx);
        }

        for(let edgeIdx = 0; edgeIdx < this.data.edges.length; edgeIdx++) {
            const edge = this.data.edges[edgeIdx];
            if((edge.source === idx) || (edge.target === idx)) {
                this.removeEdgeIdx(edgeIdx);
                edgeIdx--;  // Array size decreased, re-check this idx next loop
                continue;
            }

            if (edge.source > idx) {
                edge.source--;
            }
            if (edge.target > idx) {
                edge.target--;
            }
        }
    }

    removeEdgeIdx(idx) {
        const removedEdges = this.data.edges.splice(idx, 1);
        if (removedEdges[0]) {
            removedEdges[0].idx = undefined;
        } else {
            console.error("Tried to remove non-present edge idx", idx);
        }
    }
}