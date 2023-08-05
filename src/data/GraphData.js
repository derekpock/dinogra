import { defaultObjectValue } from '../Utilities';
import semver from 'semver';

// Nodes
//  x, y, width, height
//  name, shape, rounding

// Edges
//  source, target
//  name

const VERSION = "0.0.1";
const VERSION_SUPPORTED = "<=1.0.0";
const KEY_GRAPH_DATA = "graphData";

export class Graph {
    constructor(json = "{}") {
        this._load_from_string(json);
    }

    load() {
        const graphDataString = window.localStorage.getItem(KEY_GRAPH_DATA);
        const loadSuccess = this._load_from_string(graphDataString);
        if (loadSuccess) {
            console.debug("Loaded graphData from localStorage");
        }
        return loadSuccess;
    }

    save() {
        const graphDataString = this._save_to_string();
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

        if (!suppressEvent) {
            window.ceTriggerEvent(window.CEGraphDataModified, this);
            window.ceTriggerEvent(window.CENodeCreated, node);
        }
    }

    addEdge(edge, suppressEvent = false) {
        const idx = this.edges.push(edge) - 1;
        this.edges[idx].idx = idx;

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

    _load_from_string(str) {
        try {
            this.data = JSON.parse(str);
        } catch (e) {
            console.warn("Failed to load JSON data:", e);
            return false;
        }

        defaultObjectValue(this.data, "nodes", []);
        defaultObjectValue(this.data, "edges", []);
        defaultObjectValue(this.data, "version", VERSION)
        this.nodes = this.data.nodes;
        this.edges = this.data.edges;

        if (!semver.satisfies(this.data.version, VERSION_SUPPORTED)) {
            console.warn("Loaded graph data is not a supported version! Continuing regardless.", this.data.version, "does not satisfy", VERSION_SUPPORTED);
        }
        window.ceTriggerEvent(window.CEGraphDataModified, this);
        return true;
    }

    _save_to_string() {
        return JSON.stringify(this.data);
    }
}