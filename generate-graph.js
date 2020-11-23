const fs = require("fs");
const MarkdownIt = require("markdown-it");

const md = new MarkdownIt();

const parseFile = (url) => {
  const fileContents = fs.readFileSync(url, "utf-8");
  return {
    path: url,
    contents: md.parse(fileContents, {}),
  };
};

const parseHeader = (tokens) => {
  if (tokens.length < 3) {
    return null;
  }

  if (tokens[0].type !== "hr") {
    return null;
  }

  for (let i = 1; i < tokens.length; i++) {
    if (tokens[i].type === "inline") {
      return tokens[i].children
        .filter((token) => token.type === "text")
        .map((token) => token.content.split(": "))
        .map((token) => ({ key: token[0], value: token[1] }));
    }
  }

  return null;
};

const collectLinks = (tokens) => {
  return tokens
    .filter((token) => token.type === "inline")
    .flatMap((token) => token.children)
    .filter(
      (token) =>
        token.attrs &&
        token.attrs.length === 1 &&
        token.attrs[0][0] === "href" &&
        token.info !== "auto"
    )
    .map((token) => token.attrs[0][1]);
};

const collectFiles = (path, accFiles = []) => {
  const files = fs.readdirSync(path);
  const folders = files.filter((file) => !file.includes("."));
  const mdFiles = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => path + "/" + file);

  if (folders.length === 0) {
    return [...accFiles, ...mdFiles];
  }

  return [
    ...folders.map((folder) => collectFiles(path + "/" + folder, [])),
    ...accFiles,
    ...mdFiles,
  ];
};

const files = collectFiles(process.argv[2]).flat();

const filesContents = files.map((file) => parseFile(file));

const nodes = filesContents.map((page) => ({
  fileId: parseHeader(page.contents).find((item) => item.key === "id").value,
  contents: page.contents,
}));

const edges = nodes.flatMap((node) => {
  return collectLinks(node.contents)
    .filter((link) => {
      return nodes
        .map((node) => node.fileId)
        .includes(link.split("#")[0].replace(".md", "")); // nice hack
    })
    .map((link) => ({
      from: node.fileId,
      to: link.split("#")[0].replace(".md", ""),
    }));
});

console.log(edges);

const nodeObjects = nodes.map((node) => ({
  id: Math.random(),
  title: node.fileId,
  x: 100,
  y: 100,
  type: "empty",
}));

const graph = {
  nodes: nodeObjects,
  edges: edges.map((edge) => {
    return {
      source: edge.from,
      target: edge.to,
      type: "emptyEdge",
    };
  }),
};

fs.writeFileSync("./src/graph.json", JSON.stringify(graph));
