import React from 'react';

export class NewNodeButton extends React.Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        const node = {
            x: 0,
            y: 0,
            shape: "rectangle"
        };
        this.props.graphData.addNode(node);
    }

    render() {
        return <button onClick={this.onClick}>New Node</button>;
    }
}