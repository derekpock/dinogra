import { defaultObjectValue } from '../Utilities';
import semver from 'semver';


const VERSION = "0.0.1";
const VERSION_SUPPORTED = "<=1.0.0";
const KEY_GRAPH_DATA = "graphData";

function defaultNode(node) {
    // Also required: idx
    // Also optional: rounding
    defaultObjectValue(node, "x", 0);
    defaultObjectValue(node, "y", 0);
    defaultObjectValue(node, "width", 100);
    defaultObjectValue(node, "height", 50);
    defaultObjectValue(node, "name", "");
    defaultObjectValue(node, "shape", "rectangle");
}

function defaultEdge(edge) {
    // Also required: idx, source, target
    defaultObjectValue(edge, "name", "");
}

function validateEdge(edge, nodesCount) {
    let success = true;
    if (edge.source >= nodesCount) {
        success = false;
        console.error("Malformed edge: Idx", edge.idx, "edge has source node of idx", edge.source, "which does not exist. Max is", nodesCount - 1);
    }
    if (edge.target >= nodesCount) {
        success = false;
        console.error("Malformed edge: Idx", edge.idx, "edge has target node of idx", edge.target, "which does not exist. Max is", nodesCount - 1);
    }
    return success;
}

export class Graph {
    constructor(json = "{}") {
        this._loadFromString(json);
    }

    load() {
        const graphDataString = window.localStorage.getItem(KEY_GRAPH_DATA);
        const loadSuccess = this._loadFromString(graphDataString);
        if (loadSuccess) {
            console.debug("Loaded graphData from localStorage");
        }
        return loadSuccess;
    }

    save() {
        const graphDataString = this._saveToString();
        try {
            window.localStorage.setItem(KEY_GRAPH_DATA, graphDataString);
            const kb = (graphDataString.length / 1024).toFixed(3);
            console.debug("Saved graphData:", kb, "kb");
            // TODO: Compress using zlip gzip or other?
        } catch (e) {
            console.error("Unable to save to local storage!", e);
        }
    }

    addNode(node, suppressEvent = false) {
        const idx = this.nodes.push(node) - 1;
        this.nodes[idx].idx = idx;
        defaultNode(node);

        if (!suppressEvent) {
            window.ceTriggerEvent(window.CEGraphDataModified, this);
            window.ceTriggerEvent(window.CENodeCreated, node);
        }
    }

    addEdge(edge, suppressEvent = false) {
        const idx = this.edges.push(edge) - 1;
        this.edges[idx].idx = idx;
        defaultEdge(edge);

        if (!validateEdge(edge, this.nodes.length)) {
            this.edges.splice(idx, 1);
            return;
        }

        if (!suppressEvent) {
            window.ceTriggerEvent(window.CEGraphDataModified, this);
        }
    }

    removeNodeIdx(idx) {
        const removedNodes = this.nodes.splice(idx, 1);
        if (removedNodes[0]) {
            removedNodes[0].idx = undefined;
        } else {
            console.error("Tried to remove non-present node idx", idx);
        }

        for (let i = idx; i < this.nodes.length; i++) {
            this.nodes[i].idx--;
        }

        let edgesRemoved = 0;
        for (let i = 0; i < this.edges.length; i++) {
            const edge = this.edges[i];
            if ((edge.source === idx) || (edge.target === idx)) {
                this.edges.splice(i, 1);
                edge.idx = undefined;
                edgesRemoved++; // Other edges' idx need decremented by this much.
                i--;  // Array size decreased, re-check this i next loop.
                continue;
            }

            edge.idx -= edgesRemoved;
            if (edge.source > idx) {
                edge.source--;
            }
            if (edge.target > idx) {
                edge.target--;
            }
        }
        window.ceTriggerEvent(window.CEGraphDataModified, this);
    }

    removeEdgeIdx(idx) {
        const removedEdges = this.edges.splice(idx, 1);
        if (removedEdges[0]) {
            removedEdges[0].idx = undefined;
        } else {
            console.error("Tried to remove non-present edge idx", idx);
        }

        for (let i = idx; i < this.edges.length; i++) {
            this.edges[i].idx--;
        }
        window.ceTriggerEvent(window.CEGraphDataModified, this);
    }

    _saveToString() {
        return JSON.stringify(this.data);
    }

    _loadFromString(str) {
        let data = undefined;
        try {
            data = JSON.parse(str);
        } catch (e) {
            console.warn("Failed to load JSON data:", e);
            return false;
        }

        defaultObjectValue(data, "version", VERSION);
        defaultObjectValue(data, "nodes", []);
        defaultObjectValue(data, "edges", []);

        if (!semver.satisfies(data.version, VERSION_SUPPORTED)) {
            console.warn("Loaded graph data is not a supported version! Continuing regardless.", data.version, "does not satisfy", VERSION_SUPPORTED);
        }

        // Verify sequence and integrity of nodeIdx and edgeIdx.
        let error = false;
        for (let i = 0; i < data.nodes.length; i++) {
            const node = data.nodes[i];
            defaultNode(node);
            if (node.idx !== i) {
                error = true;
                console.error("Malformed node: Sequence", i, "has invalid idx", node.idx);
            }
        }

        for (let i = 0; i < data.edges.length; i++) {
            const edge = data.edges[i];
            defaultEdge(edge);
            if (edge.idx !== i) {
                error = true;
                console.error("Malformed edge: Sequence", i, "has invalid idx", edge.idx);
            }
            validateEdge(edge, data.nodes.length);
        }

        if (error) {
            return false;
        }

        this.data = data;
        this.nodes = this.data.nodes;
        this.edges = this.data.edges;

        window.ceTriggerEvent(window.CEGraphDataModified, this);
        return true;
    }
}