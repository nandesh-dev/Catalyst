export class File {
  constructor(name, path) {
    this.name = name;
    this.path = path;
  }
}

/*
async function parseFile(path) {
  const readFile = functionClient.getFunction("readFile");
  const file = await readFile(path);

  const ast = parse(file, {
    sourceType: "module",
    plugins: ["jsx"],
  });

  const jsxElements = [];
  const traverse = (node, { lastFunction } = {}) => {
    if (node.type === "JSXElement") {
      jsxElements.push({ node, lastFunction });
    }

    lastFunction = node.type === "FunctionDeclaration" ? node : lastFunction;

    if (Array.isArray(node.body)) {
      node.body.map((node) => traverse(node, { lastFunction }));
    } else if (typeof node.body === "object") {
      traverse(node.body, { lastFunction });
    } else if (typeof node.declaration === "object") {
      traverse(node.declaration, { lastFunction });
    } else if (typeof node.argument === "object") {
      traverse(node.argument, { lastFunction });
    }
  };

  traverse(ast.program);
  return jsxElements;
}
*/
