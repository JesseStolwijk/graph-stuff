import { ForceGraph2D } from "react-force-graph";
import graph from "../graph.json";

const graphData = {
  nodes: graph.nodes.map((node) => ({
    id: node.title,
    group: 10,
  })),
  links: graph.edges.map((edge) => ({
    source: edge.source,
    target: edge.target,
  })),
};

const Graph = () => {
  return (
    <ForceGraph2D
      graphData={graphData}
      nodeAutoColorBy="group"
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

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = node.color;
        ctx.fillText(label, node.x, node.y);
      }}
      linkWidth={2}
    />
  );
};

export default Graph;
