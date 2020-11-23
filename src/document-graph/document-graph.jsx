import { Component } from "react";
import { GraphView } from "react-digraph";
import graph from "../graph.json";

const NODE_KEY = "id"; // Allows D3 to correctly update DOM

const GraphConfig = {
  NodeTypes: {
    empty: {
      // required to show empty nodes
      typeText: "None",
      shapeId: "#empty", // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" id="empty" key="0">
          <circle cx="50" cy="50" r="45"></circle>
        </symbol>
      ),
    },
    custom: {
      // required to show empty nodes
      typeText: "Custom",
      shapeId: "#custom", // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 50" id="custom" key="0">
          <ellipse cx="50" cy="25" rx="50" ry="25"></ellipse>
        </symbol>
      ),
    },
  },
  NodeSubtypes: {},
  EdgeTypes: {
    emptyEdge: {
      // required to show empty edges
      shapeId: "#emptyEdge",
      shape: (
        <symbol viewBox="0 0 50 50" id="emptyEdge" key="0">
          <circle cx="25" cy="25" r="8" fill="currentColor">
            {" "}
          </circle>
        </symbol>
      ),
    },
  },
};

class DocumentGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graph,
      nodes: graph.nodes,
      selected: {},
    };
  }

  render() {
    const edges = this.state.graph.edges;
    const selected = this.state.selected;

    const NodeTypes = GraphConfig.NodeTypes;
    const NodeSubtypes = GraphConfig.NodeSubtypes;
    const EdgeTypes = GraphConfig.EdgeTypes;

    return (
      <div id="graph" style={{ height: "100vh", margin: "0", padding: "0" }}>
        <button
          onClick={() =>
            this.setState({
              nodes: [
                ...this.state.nodes,
                {
                  id: Math.random(),
                  title: "Custon node",
                  x: 100,
                  y: 100,
                  type: "empty",
                },
              ],
            })
          }
        >
          Create node
        </button>
        <GraphView
          ref="GraphView"
          nodeKey={NODE_KEY}
          nodes={this.state.nodes}
          edges={edges}
          selected={selected}
          nodeTypes={NodeTypes}
          nodeSubtypes={NodeSubtypes}
          edgeTypes={EdgeTypes}
          onSelectNode={this.onSelectNode}
          onCreateNode={this.onCreateNode}
          onUpdateNode={this.onUpdateNode}
          onDeleteNode={this.onDeleteNode}
          onSelectEdge={this.onSelectEdge}
          onCreateEdge={this.onCreateEdge}
          onSwapEdge={this.onSwapEdge}
          onDeleteEdge={this.onDeleteEdge}
        />
      </div>
    );
  }
}

export default DocumentGraph;
