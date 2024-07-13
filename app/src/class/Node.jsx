export class Node {
  constructor(uuid, path, parentFunctionPath, project) {
    this.path = path;
    this.uuid = uuid;
    this._project = project;
    this._parentFunctionPath = parentFunctionPath;

    if (this._project.config.nodes[this.uuid]) {
      this.name = this._project.config.nodes[this.uuid].name;
    } else {
      this.name = this._parentFunctionPath
        ? this._parentFunctionPath.node.id.name
        : "Node" + Math.round(Math.random() * 100);

      this._project.config.nodes[this.uuid] = {
        name: this.name,
      };
      this._project.writeConfig();
    }
  }

  updateName(newName) {
    this.name = newName;
    this._project.config.nodes[this.uuid].name = this.name;
    this._project.writeConfig();
  }
}
