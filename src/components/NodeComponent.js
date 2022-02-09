import React from 'react';
// import ReactDOM from 'react-dom';
import { defaultObjectValue } from '../Utilities';

export class NodeComponent extends React.Component {
    constructor(props) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        // this.onTouchStart = this.onTouchStart.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);

        if (defaultObjectValue(this.props.data, "x", 100)) {
            console.warn("Node with name", this.props.data.name, "and idx", this.props.data.idx, "has no x component. Defaulting.");
        }

        if (defaultObjectValue(this.props.data, "y", 100)) {
            console.warn("Node with name", this.props.data.name, "and idx", this.props.data.idx, "has no y component. Defaulting.");
        }

        if (defaultObjectValue(this.props.data, "width", 100)) {
            console.warn("Node with name", this.props.data.name, "and idx", this.props.data.idx, "has no width component. Defaulting.");
        }

        if (defaultObjectValue(this.props.data, "height", 50)) {
            console.warn("Node with name", this.props.data.name, "and idx", this.props.data.idx, "has no height component. Defaulting.");
        }
    }

    onMouseDown(e) {
        this.props.api.mouseDownOnNode(e, this);
    }

    onMouseUp(e) {
        this.props.api.mouseUpOnNode(e, this);
    }

    // onTouchStart(e) {
    //     console.log(e)
    //     if (e.touches.length === 1) {
    //         this.props.api.mouseDownOnNode(e.touches[0], this);
    //     }
    // }

    onContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        const data = this.props.data;

        let element;
        switch (this.props.data.shape) {
            // return <rectangle width="100" height="50" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)"/>;
            case "rectangle":
                element = <rect
                    className="node"
                    width={data.width} height={data.height}
                    x={data.x - (data.width / 2)} y={data.y - (data.height / 2)} rx={data.rounding} ry={data.rounding}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}
                    // onTouchStart={this.onTouchStart}
                    onContextMenu={this.onContextMenu}
                />;
                break;

            default:
            case undefined:
                if (this.shapeWarning === undefined) {
                    console.warn("Shape with idx", this.props.data.idx, "has an undefined or unknown shape:", this.props.data.shape);
                    this.shapeWarning = true;
                }
            // fallthrough
            case "ellipse":
                element = <ellipse
                    className="node"
                    rx={data.width / 2} ry={data.height / 2}
                    cx={data.x} cy={data.y}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}
                    // onTouchStart={this.onTouchStart}
                    onContextMenu={this.onContextMenu}
                />;
        }

        return element;
    }
}