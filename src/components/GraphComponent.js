import React from 'react';
import { NodeComponent } from './NodeComponent';
import { EdgeComponent } from './EdgeComponent';
import { EdgeCreating } from './EdgeCreating';

const SCROLLWHEEL_SCALE_RATIO = 0.002

export class GraphComponent extends React.Component {
    constructor(props) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);

        this.recheckWindowDimPos = this.recheckWindowDimPos.bind(this);
        this.startCanvasMove = this.startCanvasMove.bind(this);
        this.calculateGraphMouse = this.calculateGraphMouse.bind(this);
        this.stopAllMoves = this.stopAllMoves.bind(this);
        this.getGraphData = this.getGraphData.bind(this);

        this.state = {
            windowDimension: { width: window.innerWidth, height: window.innerHeight },
            windowPosition: { x: 0, y: 0 },
            windowScale: 1.0
        };

        this.mousePosition = undefined;
        this.movingCanvas = false;
        this.graphMouseLast = null;
    }

    componentDidMount() {
        window.ceRegisterEvent(window.CEWindowResize, this.recheckWindowDimPos);
        window.ceRegisterEvent(window.CELaunch, this.stopAllMoves);
        window.ceRegisterEvent(window.CEMouseMove, this.calculateGraphMouse);
    }

    componentWillUnmount() {
        window.ceUnregisterEvent(window.CEWindowResize, this.recheckWindowDimPos);
        window.ceUnregisterEvent(window.CELaunch, this.stopAllMoves);
        window.ceUnregisterEvent(window.CEMouseMove, this.calculateGraphMouse);
    }

    onMouseDown(e) {
        if (e.button === 0) {
            this.startCanvasMove(e);
            e.stopPropagation();
        }
    }

    onTouchStart(e) {
        if (e.touches.length === 1) {
            this.startCanvasMove(e.touches[0]);
            e.stopPropagation();
        }
    }

    onWheel(e) {
        this.setState((state) => {
            const normalizedDelta = e.deltaY * SCROLLWHEEL_SCALE_RATIO;
            const newScale =
                Math.max(
                    Math.min(
                        state.windowScale * Math.exp(normalizedDelta),
                        2e30),
                    2e-30);

            const scaleDiff = state.windowScale - newScale;

            const xAdjustment = scaleDiff * e.clientX;
            const yAdjustment = scaleDiff * e.clientY;

            return {
                windowScale: newScale,
                windowPosition: {
                    x: state.windowPosition.x + xAdjustment,
                    y: state.windowPosition.y + yAdjustment
                }
            };
        });
    }

    recheckWindowDimPos(e) {
        this.setState((state) => {
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

    startCanvasMove(e) {
        this.movingCanvas = true;
        this.calculateGraphMouse(e);
    }

    calculateGraphMouse(e) {
        this.setState((state) => {
            const graphX = (this.state.windowScale * e.clientX) + this.state.windowPosition.x;
            const graphY = (this.state.windowScale * e.clientY) + this.state.windowPosition.y;

            e.ceGraphMouseLast = this.graphMouseLast;
            e.ceGraphMouse = { x: graphX, y: graphY };
            window.ceTriggerEvent(window.CEGraphMouseMove, e);
            this.graphMouseLast = e.ceGraphMouse;

            if (this.movingCanvas) {
                if (this.mousePosition !== undefined) {
                    const diffX = (e.ceGraphMouse.x - this.mousePosition.x);
                    const diffY = (e.ceGraphMouse.y - this.mousePosition.y);
                    return {
                        windowPosition: {
                            x: state.windowPosition.x - diffX,
                            y: state.windowPosition.y - diffY
                        }
                    };
                }
                this.mousePosition = e.ceGraphMouse;
            }
        });
    }

    stopAllMoves(e) {
        if (e.button === 0) {
            this.movingCanvas = false;
            this.mousePosition = undefined;
        }
    }

    getGraphData() { return this.props.graphData; }

    render() {
        const graphData = this.props.graphData;
        if (graphData === undefined) {
            return <div>Undefined GraphData</div>;
        }

        const viewBox = {
            x1: this.state.windowPosition.x,
            y1: this.state.windowPosition.y,
            x2: this.state.windowPosition.x + (this.state.windowDimension.width * this.state.windowScale),
            y2: this.state.windowPosition.y + (this.state.windowDimension.height * this.state.windowScale)
        };

        const edgeComponents = graphData.data.edges.map((edge) => {
            return <EdgeComponent key={edge.idx} data={edge} getGraphData={this.getGraphData} viewBox={viewBox} />;
        });

        const nodeComponents = graphData.data.nodes.map((node) => {
            return <NodeComponent key={node.idx} data={node} getGraphData={this.getGraphData} viewBox={viewBox} />;
        });

        const edgeCreating = <EdgeCreating getGraphData={this.getGraphData} />;

        const viewBoxString =
            this.state.windowPosition.x + " " +
            this.state.windowPosition.y + " " +
            (this.state.windowDimension.width * this.state.windowScale) + " " +
            (this.state.windowDimension.height * this.state.windowScale);

        return <svg
            onWheel={this.onWheel}
            onMouseDown={this.onMouseDown}
            onTouchStart={this.onTouchStart}
            className="graphComponent"
            viewBox={viewBoxString}>
            {edgeComponents}
            {edgeCreating}
            {nodeComponents}
        </svg>;
    }
}