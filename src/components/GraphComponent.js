import React from 'react';
// import ReactDOM from 'react-dom';
// import { Graph } from '../data/GraphData';
import { NodeComponent } from './NodeComponent';
import { EdgeComponent } from './EdgeComponent';

const SCROLLWHEEL_SCALE_RATIO = 0.002

export class GraphComponent extends React.Component {
    constructor(props) {
        super(props);

        // componentDidMount
        // componentWillUnmount

        this.recheckWindowDimPos = this.recheckWindowDimPos.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);

        this.updateMousePosition = this.updateMousePosition.bind(this);
        this.startCanvasMove = this.startCanvasMove.bind(this);
        this.mouseDownOnNode = this.mouseDownOnNode.bind(this);
        this.mouseUpOnNode = this.mouseUpOnNode.bind(this);
        this.processMoves = this.processMoves.bind(this);
        this.stopAllMoves = this.stopAllMoves.bind(this);
        this.getGraphData = this.getGraphData.bind(this);
        // this.createEdgeComponent = this.createEdgeComponent.bind(this);

        // render

        this.state = {
            windowDimension: { width: window.innerWidth, height: window.innerHeight },
            windowPosition: { x: 0, y: 0 },
            windowScale: 1.0,
            mousePosition: undefined,
            creatingEdgeSource: undefined
        };

        this.stopAllMoves();
    }

    componentDidMount() {
        window.ceRegisterEvent(window.CEResize, this.recheckWindowDimPos);

        window.ceRegisterEvent(window.CEBlur, this.stopAllMoves);
        window.ceRegisterEvent(window.CEMouseUp, this.stopAllMoves);
        window.ceRegisterEvent(window.CETouchEnd, this.stopAllMoves);
        window.ceRegisterEvent(window.CETouchCancel, this.stopAllMoves);

        window.ceRegisterEvent(window.CEMouseMove, this.processMoves);
        window.ceRegisterEvent(window.CETouchMove, this.onTouchMove);

        window.ceRegisterEvent(window.CEContextMenu, this.onContextMenu);
    }

    componentWillUnmount() {
        window.ceUnregisterEvent(window.CEResize, this.recheckWindowDimPos);

        window.ceUnregisterEvent(window.CEBlur, this.stopAllMoves);
        window.ceUnregisterEvent(window.CEMouseUp, this.stopAllMoves);
        window.ceUnregisterEvent(window.CETouchEnd, this.stopAllMoves);
        window.ceUnregisterEvent(window.CETouchCancel, this.stopAllMoves);

        // TODO work to combine "touch" and "mouse move" events into a single event.
        window.ceUnregisterEvent(window.CEMouseMove, this.processMoves);
        window.ceUnregisterEvent(window.CETouchMove, this.onTouchMove);

        window.ceUnregisterEvent(window.CEContextMenu, this.onContextMenu);
    }

    recheckWindowDimPos(e) {
        this.setState(function (state) {
            const widthDiff = state.windowDimension.width - window.innerWidth;
            const heightDiff = state.windowDimension.height - window.innerHeight;
            return {
                windowDimension: { width: window.innerWidth, height: window.innerHeight },
                windowPosition: {
                    x: state.windowPosition.x + ((widthDiff / 2) * state.windowScale),
                    y: state.windowPosition.y + ((heightDiff / 2) * state.windowScale)
                }
            };
        });
    };


    onMouseDown(e) {
        if (e.button === 0) {
            this.startCanvasMove(e);
        }
    }

    onWheel(e) {
        this.setState(function (state) {
            const normalizedDelta = e.deltaY * SCROLLWHEEL_SCALE_RATIO;
            const newScale = state.windowScale * Math.exp(normalizedDelta);

            const scaleDiff = state.windowScale - newScale;

            const xAdjustment = scaleDiff * e.clientX
            const yAdjustment = scaleDiff * e.clientY

            return {
                windowScale: newScale,
                windowPosition: {
                    x: state.windowPosition.x + xAdjustment,
                    y: state.windowPosition.y + yAdjustment
                }
            };
        });
    }

    onTouchStart(e) {
        if (e.touches.length === 1) {
            this.startCanvasMove(e.touches[0]);
        }
    }

    onTouchMove(e) {
        if (e.touches.length === 1) {
            this.processMoves(e.touches[0]);
        }
    }

    onContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    updateMousePosition(e) {
        this.setState((state) => ({ mousePosition: { x: e.clientX, y: e.clientY } }))
    }

    startCanvasMove(e) {
        this.updateMousePosition(e);
        this.movingCanvas = true;
    }

    mouseDownOnNode(e, node) {
        this.updateMousePosition(e);
        if (e.button === 0) {
            this.movingNode = node;
        } else if (e.button === 2) {
            this.setState((state) => ({ creatingEdgeSource: node }))
        }
    }

    mouseUpOnNode(e, node) {
        const creatingEdgeSource = this.state.creatingEdgeSource;
        if (creatingEdgeSource !== undefined && creatingEdgeSource !== node) {
            const newEdge = { source: creatingEdgeSource.props.data.idx, target: node.props.data.idx };
            this.props.graphData.addEdge(newEdge);
            this.props.graphData.save();
        }
    }

    processMoves(e) {
        if (this.state.mousePosition !== undefined) {
            const diffX = (e.clientX - this.state.mousePosition.x) * this.state.windowScale;
            const diffY = (e.clientY - this.state.mousePosition.y) * this.state.windowScale;

            if (this.movingNode !== undefined) {
                this.movingNode.props.data.x += diffX;
                this.movingNode.props.data.y += diffY;
            } else if (this.movingCanvas) {
                this.setState((state) => ({
                    windowPosition: {
                        x: state.windowPosition.x - diffX,
                        y: state.windowPosition.y - diffY
                    }
                }));
            }
            this.updateMousePosition(e);
        }
    }

    stopAllMoves() {
        if (this.movingNode !== undefined) {
            this.props.graphData.save();
        }

        this.movingNode = undefined;
        this.movingCanvas = false;

        this.setState((state) => ({ creatingEdgeSource: undefined, mousePosition: undefined }))
    }

    getGraphData() { return this.props.graphData; }

    render() {
        const graphData = this.props.graphData;
        if (graphData === undefined) {
            return <div>Undefined GraphData</div>;
        }

        const nodeApi = {
            getGraphData: this.getGraphData,
            mouseDownOnNode: this.mouseDownOnNode,
            mouseUpOnNode: this.mouseUpOnNode
        }

        const edgeComponents = graphData.data.edges.map((edge) => {
            return <EdgeComponent key={edge.idx} data={edge} getGraphData={this.getGraphData} />;
        });

        let creatingEdgeGhost = undefined;
        if (this.state.creatingEdgeSource !== undefined) {
            creatingEdgeGhost = <line
                x1={this.state.creatingEdgeSource.props.data.x}
                y1={this.state.creatingEdgeSource.props.data.y}
                x2={(this.state.windowScale * this.state.mousePosition.x) + this.state.windowPosition.x}
                y2={(this.state.windowScale * this.state.mousePosition.y) + this.state.windowPosition.y}
                className="edge"
            />;
        }

        const nodeComponents = graphData.data.nodes.map((node) => {
            return <NodeComponent key={node.idx} data={node} api={nodeApi} />;
        });

        const viewBox =
            this.state.windowPosition.x + " " +
            this.state.windowPosition.y + " " +
            (this.state.windowDimension.width * this.state.windowScale) + " " +
            (this.state.windowDimension.height * this.state.windowScale);

        return <svg
            onWheel={this.onWheel}
            onMouseDown={this.onMouseDown}
            onTouchStart={this.onTouchStart}
            className="graphComponent"
            viewBox={viewBox}>
            {edgeComponents}
            {creatingEdgeGhost}
            {nodeComponents}
        </svg>;
    }
}