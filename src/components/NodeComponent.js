import React from 'react';
import { doesPointIntersectBox } from '../Utilities';

export class NodeComponent extends React.Component {
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
        e.ceNode = this.props.data;
        window.ceTriggerEvent(window.CENodeLand, e);

        if (e.button === 0) {
            this.startMove();
            e.stopPropagation();
        }
    }

    onMouseUp(e) {
        e.ceNode = this.props.data;
        window.ceTriggerEvent(window.CENodeLaunch, e);
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
            this.props.data.x += diffX;
            this.props.data.y += diffY;
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
        const viewBox = this.props.viewBox;
        const width = data.width != null ? data.width : 100;
        const height = data.height != null ? data.height : 50;

        const bufferedViewBox = {
            x1: viewBox.x1 - (width / 2),
            y1: viewBox.y1 - (height / 2),
            x2: viewBox.x2 + (width / 2),
            y2: viewBox.y2 + (height / 2)
        };

        if (!this.moving && !doesPointIntersectBox(data, bufferedViewBox) && window.debugRenderAll !== true) {
            return null;
        }

        const x = data.x != null ? data.x : 100;
        const y = data.y != null ? data.y : 100;
        const rounding = data.rounding;

        let element;
        switch (data.shape) {
            // return <rectangle width="100" height="50" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)"/>;
            case "rectangle":
                element = <rect
                    className="node"
                    width={width} height={height}
                    x={x - (width / 2)} y={y - (height / 2)} rx={rounding} ry={rounding}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}
                />;
                break;

            default:
            case undefined:
                if (this.shapeWarning === undefined) {
                    console.warn("Shape with idx", data.idx, "has an undefined or unknown shape:", data.shape);
                    this.shapeWarning = true;
                }
            // fallthrough
            case "ellipse":
                element = <ellipse
                    className="node"
                    rx={width / 2} ry={height / 2}
                    cx={x} cy={y}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}
                />;
        }

        return element;
    }
}