import React from 'react';

export class NodeComponent extends React.Component {
    constructor(props) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.onLaunch = this.onLaunch.bind(this);
        this.onMove = this.onMove.bind(this);

        this.moving = false;
    }

    componentDidMount() {
        window.ceRegisterEvent(window.CELaunch, this.onLaunch);
        window.ceRegisterEvent(window.CEGraphMouseMove, this.onMove);
    }

    componentWillUnmount() {
        window.ceUnregisterEvent(window.CELaunch, this.onLaunch);
        window.ceUnregisterEvent(window.CEGraphMouseMove, this.onMove);
    }

    onMouseDown(e) {
        e.ceNode = this.props.data;
        window.ceTriggerEvent(window.CENodeLand, e);

        if (e.button === 0) {
            this.moving = true;
            e.stopPropagation();
        }
    }

    onMouseUp(e) {
        e.ceNode = this.props.data;
        window.ceTriggerEvent(window.CENodeLaunch, e);
        this.onLaunch(e);
    }

    onLaunch(e) {
        if (this.moving) {
            this.moving = false;
            this.props.getGraphData().save();
        }
    }

    onMove(e) {
        if (this.moving && e.ceGraphMouseLast) {
            const diffX = e.ceGraphMouse.x - e.ceGraphMouseLast.x;
            const diffY = e.ceGraphMouse.y - e.ceGraphMouseLast.y;
            this.props.data.x += diffX;
            this.props.data.y += diffY;
            window.ceTriggerEvent(window.CEGraphDataModified, this.props.getGraphData());
        }
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