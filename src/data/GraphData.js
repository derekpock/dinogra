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
        const idx = this.data.nodes.push(node) - 1;
        this.data.nodes[idx].idx = idx;
        if (!suppressEvent) {
            window.ceTriggerEvent(window.CEGraphDataModified, this);
        }
    }

    addEdge(edge, suppressEvent = false) {
        const idx = this.data.edges.push(edge) - 1;
        this.data.edges[idx].idx = idx;
        if (!suppressEvent) {
            window.ceTriggerEvent(window.CEGraphDataModified, this);
        }
    }

    removeNodeIdx(idx) {
        const removedNodes = this.data.nodes.splice(idx, 1);
        if (removedNodes[0]) {
            removedNodes[0].idx = undefined;
        } else {
            console.error("Tried to remove non-present node idx", idx);
        }

        for (let edgeIdx = 0; edgeIdx < this.data.edges.length; edgeIdx++) {
            const edge = this.data.edges[edgeIdx];
            if ((edge.source === idx) || (edge.target === idx)) {
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
        window.ceTriggerEvent(window.CEGraphDataModified, this);
    }

    removeEdgeIdx(idx) {
        const removedEdges = this.data.edges.splice(idx, 1);
        if (removedEdges[0]) {
            removedEdges[0].idx = undefined;
        } else {
            console.error("Tried to remove non-present edge idx", idx);
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