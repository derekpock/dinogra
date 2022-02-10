import React from 'react';
// import ReactDOM from 'react-dom';

export class EdgeComponent extends React.Component {
    render() {
        const data = this.props.data;
        const graphData = this.props.getGraphData();

        const sourceNode = graphData.nodes[data.source];
        const targetNode = graphData.nodes[data.target];

        const x1 = sourceNode.x != null ? sourceNode.x : 0;
        const y1 = sourceNode.y != null ? sourceNode.y : 0;
        const x2 = targetNode.x != null ? targetNode.x : 0;
        const y2 = targetNode.y != null ? targetNode.y : 0;
        const stroke = data.color;

        return <line className="edge" x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} />;
    }
}