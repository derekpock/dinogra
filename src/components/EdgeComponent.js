import React from 'react';
import { doesLineIntersectBox } from '../Utilities';
// import ReactDOM from 'react-dom';

export class EdgeComponent extends React.Component {

    constructor(props) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.onLaunch = this.onLaunch.bind(this);
        this.onMove = this.onMove.bind(this);

        this.moving = false;
    }

    componentWillUnmount() {
        if (this.moving) {
            this.stopMove();
        }
    }

    onMouseDown(e) {
        e.ceEdge = this.props.data;
        window.ceTriggerEvent(window.CEEdgeLand, e);

        if (e.button === 0) {
            this.startMove();
            e.stopPropagation();
        }
    }

    onMouseUp(e) {
        e.ceNode = this.props.data;
        window.ceTriggerEvent(window.CEEdgeLaunch, e);
        if (this.moving) {
            this.onLaunch(e);
        }
    }

    onLaunch(e) {
        // Calls from both onMouseUp and CELaunch are only possible if moving.
        if (e.button === 0) {
            this.stopMove();
            this.props.getGraphData().save();
        }
    }

    onMove(e) {
        // Only callable if moving.
        if (e.ceGraphMouseLast) {
            const diffX = e.ceGraphMouse.x - e.ceGraphMouseLast.x;
            const diffY = e.ceGraphMouse.y - e.ceGraphMouseLast.y;

            // Move both the source and destination nodes when the edge is dragged.
            const graphData = this.props.getGraphData();

            const sourceNode = graphData.nodes[this.props.data.source];
            const targetNode = graphData.nodes[this.props.data.target];

            sourceNode.x = (sourceNode.x != null ? sourceNode.x : 0) + diffX;
            sourceNode.y = (sourceNode.y != null ? sourceNode.y : 0) + diffY;

            targetNode.x = (targetNode.x != null ? targetNode.x : 0) + diffX;
            targetNode.y = (targetNode.y != null ? targetNode.y : 0) + diffY;

            window.ceTriggerEvent(window.CEGraphDataModified, this.props.getGraphData());
        }
    }

    startMove() {
        this.moving = true;
        window.ceRegisterEvent(window.CELaunch, this.onLaunch);
        window.ceRegisterEvent(window.CEGraphMouseMove, this.onMove);
    }

    stopMove() {
        this.moving = false;
        window.ceUnregisterEvent(window.CELaunch, this.onLaunch);
        window.ceUnregisterEvent(window.CEGraphMouseMove, this.onMove);
    }

    render() {
        const data = this.props.data;
        const graphData = this.props.getGraphData();

        const sourceNode = graphData.nodes[data.source];
        const targetNode = graphData.nodes[data.target];

        if (!this.moving && !doesLineIntersectBox(sourceNode, targetNode, this.props.viewBox) && window.debugRenderAll !== true) {
            return null;
        }

        const x1 = sourceNode.x != null ? sourceNode.x : 0;
        const y1 = sourceNode.y != null ? sourceNode.y : 0;
        const x2 = targetNode.x != null ? targetNode.x : 0;
        const y2 = targetNode.y != null ? targetNode.y : 0;
        const stroke = data.color;

        return <>
            <line
                className="edgeHitbox"
                x1={x1} y1={y1} x2={x2} y2={y2}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp} />
            <line
                className="edge"
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={stroke}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp} />
        </>;
    }
}