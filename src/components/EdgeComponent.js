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
        this.landed = false;
    }

    componentWillUnmount() {
        if (this.moving) {
            this.stopMove();
        }

        if (this.landed) {  // Moving implies landed. May be landed without moving.
            window.ceUnregisterEvent(window.CEGraphMouseMove, this.onMove);
        }
    }

    onMouseDown(e) {
        e.ceEdge = this.props.data;
        window.ceTriggerEvent(window.CEEdgeLand, e);

        if (e.button === 0) {
            this.startMove();
            e.stopPropagation();
        }
        this.landed = true;
        window.ceRegisterEvent(window.CELaunch, this.onLaunch);
    }

    onMouseUp(e) {
        e.ceNode = this.props.data;
        window.ceTriggerEvent(window.CEEdgeLaunch, e);

        if (this.landed && e.button === 1) {
            this.props.getGraphData().removeEdgeIdx(this.props.data.idx);
            this.props.getGraphData().save();
        }

        this.onLaunch(e);
    }

    onLaunch(e) {
        if (this.landed) {  // Moving implies landed. May be landed without moving.
            window.ceUnregisterEvent(window.CELaunch, this.onLaunch);
        }

        if (this.moving && e.button === 0) {
            this.stopMove();
            this.props.getGraphData().save();
        }

        this.landed = false;
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

            sourceNode.x = sourceNode.x + diffX;
            sourceNode.y = sourceNode.y + diffY;

            targetNode.x = targetNode.x + diffX;
            targetNode.y = targetNode.y + diffY;

            window.ceTriggerEvent(window.CEGraphDataModified, this.props.getGraphData());
        }
    }

    startMove() {
        this.moving = true;
        window.ceRegisterEvent(window.CEGraphMouseMove, this.onMove);
    }

    stopMove() {
        this.moving = false;
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

        const x1 = sourceNode.x;
        const y1 = sourceNode.y;
        const x2 = targetNode.x;
        const y2 = targetNode.y;
        const stroke = data.color;

        // TODO: edge hitbox makes selecting edges very close together difficult.
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