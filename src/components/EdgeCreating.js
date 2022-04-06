import React from 'react';

export class EdgeCreating extends React.Component {

    constructor(props) {
        super(props);

        this.onNodeLand = this.onNodeLand.bind(this);
        this.onLaunch = this.onLaunch.bind(this);
        this.onMove = this.onMove.bind(this);

        this.state = {
            creatingEdgeSource: null,
            mousePosition: null
        };
    }

    componentDidMount() {
        window.ceRegisterEvent(window.CENodeLand, this.onNodeLand);
        window.ceRegisterEvent(window.CENodeLaunch, this.onLaunch);
        window.ceRegisterEvent(window.CELaunch, this.onLaunch);
        window.ceRegisterEvent(window.CEGraphMouseMove, this.onMove);
    }

    componentWillUnmount() {
        window.ceUnregisterEvent(window.CENodeLand, this.onNodeLand);
        window.ceUnregisterEvent(window.CENodeLaunch, this.onLaunch);
        window.ceUnregisterEvent(window.CELaunch, this.onLaunch);
        window.ceUnregisterEvent(window.CEGraphMouseMove, this.onMove);
    }

    onNodeLand(e) {
        if (e.ceNode == null) {
            console.error("Received NodeLand without node data", e);
            return;
        }

        if (e.button === 2) {
            this.setState({
                creatingEdgeSource: e.ceNode
            });
        }
    }

    onLaunch(e) {
        let newEdge;
        this.setState((state) => {
            const creatingEdge = state.creatingEdgeSource != null;
            const secondaryLaunch = e.button === 2;

            if (creatingEdge && secondaryLaunch) {
                const launchFromNode = e.ceNode != null;
                const launchNotFromSourceNode = e.ceNode !== state.creatingEdgeSource;

                if (launchFromNode && launchNotFromSourceNode) {
                    newEdge = { source: state.creatingEdgeSource.idx, target: e.ceNode.idx };
                }
                return { creatingEdgeSource: null, mousePosition: null };
            }
            return {};
        }, () => {
            if (newEdge != null) {
                this.props.getGraphData().addEdge(newEdge);
                this.props.getGraphData().save();
            }
        });
    }

    onMove(e) {
        this.setState((state) => {
            if (state.creatingEdgeSource != null) {
                return { mousePosition: e.ceGraphMouse };
            }
            return {};
        });
    }

    render() {
        if (this.state.creatingEdgeSource != null && this.state.mousePosition != null) {
            return <line
                x1={this.state.creatingEdgeSource.x}
                y1={this.state.creatingEdgeSource.y}
                x2={this.state.mousePosition.x}
                y2={this.state.mousePosition.y}
                className="edge"
            />;
        }

        return null;
    }
}