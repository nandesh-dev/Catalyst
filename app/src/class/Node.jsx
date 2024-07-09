export class Node {
  constructor(path, parentFunctionPath) {
    this.path = path;
    this._parentFunctionPath = parentFunctionPath;

    this.name = this._parentFunctionPath
      ? this._parentFunctionPath.node.id.name
      : "Node" + Math.round(Math.random() * 10);
  }

  getName() {}
}
