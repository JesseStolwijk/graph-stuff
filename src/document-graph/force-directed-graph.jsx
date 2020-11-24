import { ForceGraph2D } from "react-force-graph";
import graph from "../graph.json";
import Modal from "react-modal";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

const graphData = {
  nodes: graph.nodes.map((node) => ({
    id: node.title,
    group: 15,
  })),
  links: graph.edges.map((edge) => ({
    source: edge.source,
    target: edge.target,
  })),
};

const renderers = {
  code: ({ language, value }) => {
    return (
      <SyntaxHighlighter style={dark} language={language} children={value} />
    );
  },
};

Modal.setAppElement("#root");

const Graph = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [clickedNode, setClickedNode] = useState(null);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleNodeClick = (node) => {
    setClickedNode(node.id);
    setIsOpen(true);
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <button onClick={closeModal}>close</button>
        <ReactMarkdown renderers={renderers} plugins={[gfm]}>
          {graph.nodes.find((node) => node.title === clickedNode)?.fileContents}
        </ReactMarkdown>
      </Modal>
      <ForceGraph2D
        graphData={graphData}
        nodeAutoColorBy="group"
        onNodeClick={handleNodeClick}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            (n) => n + fontSize * 0.2
          ); // some padding

          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions
          );

          ctx.fillStyle = "blue";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, node.x, node.y);
        }}
        linkWidth={3}
      />
    </div>
  );
};

export default Graph;
