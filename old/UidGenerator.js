export class UidGenerator {
    constructor(graphData) {
        this.preGeneratedUidCount = 5;
        this.preGeneratedUids = [];
        this.graphData = graphData;

        this.generateNewUids = this.generateNewUids.bind(this);
    }

    getUid() {
        if (this.preGeneratedUids.length === 0) {
            this.generateOneNewUid();
        }
        const uid = this.preGeneratedUids.shift();
        setTimeout(this.generateNewUids, 0);
        return uid;
    }

    generateOneNewUid() {
        let newUid = 1;
        if (this.lastGeneratedUid !== undefined) {
            newUid = this.lastGeneratedUid + 1;
        }

        const lastNode = this.graphData.nodes[this.graphData.nodes.length - 1];
        if (lastNode !== undefined && newUid <= lastNode.uid) {
            newUid = lastNode.uid + 1;
        }

        const lastEdge = this.graphData.edges[this.graphData.edges.length - 1];
        if(lastEdge !== undefined && newUid <= lastEdge.uid) {
            newUid = lastEdge.uid + 1;
        }

        this.lastGeneratedUid = newUid;
        this.preGeneratedUids.push(newUid);
    }

    generateNewUids() {
        while (this.preGeneratedUids.length < this.preGeneratedUidCount) {
            this.generateOneNewUid();
        }
    }
}