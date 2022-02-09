import React from 'react';
// import ReactDOM from 'react-dom';

export class EdgeComponent extends React.Component {
    render() {
        const data = this.props.data;
        const graphData = this.props.getGraphData();

        const sourceNode = graphData.nodes[data.source];
        const targetNode = graphData.nodes[data.target];
        
        return <line className="edge" x1={sourceNode.x} y1={sourceNode.y} x2={targetNode.x} y2={targetNode.y} stroke={data.color} />;
    }
}