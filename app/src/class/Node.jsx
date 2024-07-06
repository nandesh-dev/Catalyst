export class Node {
  constructor(node, parentPath, parentFunctionPath) {
    this.node = node;
    this._parentPath = parentPath;
    this._parentFunctionPath = parentFunctionPath;

    this.name = this._parentFunctionPath
      ? this._parentFunctionPath.node.id.name
      : "Node" + Math.round(Math.random() * 10);
  }

  getName() {}
}
