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
    }

    componentWillUnmount() {
        window.ceUnregisterEvent(window.CENodeLand, this.onNodeLand);
        if (this.state.creatingEdgeSource != null) {
            window.ceUnregisterEvent(window.CEGraphMouseMove, this.onMove);
            window.ceUnregisterEvent(window.CELaunch, this.onLaunch);
            window.ceUnregisterEvent(window.CENodeLaunch, this.onLaunch);
        }
    }

    onNodeLand(e) {
        if (e.ceNode == null) {
            console.error("Received NodeLand without node data", e);
            return;
        }

        if (e.button === 2) {
            this.setState(() => {
                return { creatingEdgeSource: e.ceNode };
            }, () => {
                window.ceRegisterEvent(window.CEGraphMouseMove, this.onMove);
                window.ceRegisterEvent(window.CELaunch, this.onLaunch);
                window.ceRegisterEvent(window.CENodeLaunch, this.onLaunch);
            });
        }
    }

    onLaunch(e) {
        // Only callable when creating edge with secondary land.
        let newEdge;
        let creatingEdge;
        this.setState((state) => {
            creatingEdge = state.creatingEdgeSource != null;
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
            // This is separate because setState needs to be reentrant (called twice, same resultant state each time).
            if (newEdge != null) {
                this.props.getGraphData().addEdge(newEdge);
                this.props.getGraphData().save();
            }
            if (creatingEdge && this.state.creatingEdgeSource == null) {
                window.ceUnregisterEvent(window.CEGraphMouseMove, this.onMove);
                window.ceUnregisterEvent(window.CELaunch, this.onLaunch);
                window.ceUnregisterEvent(window.CENodeLaunch, this.onLaunch);
            }
        });
    }

    onMove(e) {
        // Only callable when creating edge with secondary land.
        this.setState(() => {
            return { mousePosition: e.ceGraphMouse };
        });
    }

    render() {
        if (this.state.creatingEdgeSource != null && this.state.mousePosition != null) {
            return <line
                x1={this.state.creatingEdgeSource.x}
                y1={this.state.creatingEdgeSource.y}
                x2={this.state.mousePosition.x}
                y2={this.state.mousePosition.y}
                className="edge edgeCreating"
            />;
        }

        return null;
    }
}