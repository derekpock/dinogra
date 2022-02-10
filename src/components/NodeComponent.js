import React from 'react';
// import ReactDOM from 'react-dom';

export class NodeComponent extends React.Component {
    constructor(props) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        // this.onTouchStart = this.onTouchStart.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
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
        const width = data.width != null ? data.width : 100;
        const height = data.height != null ? data.height : 50;
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
                    // onTouchStart={this.onTouchStart}
                    onContextMenu={this.onContextMenu}
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
                    // onTouchStart={this.onTouchStart}
                    onContextMenu={this.onContextMenu}
                />;
        }

        return element;
    }
}