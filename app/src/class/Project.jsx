import { useState, useEffect, useContext, createContext } from "react";

import { functionClient } from "../functionClient";
import { Directory } from "./Directory.jsx";
import { File } from "./File.jsx";

export class Project {
  constructor() {
    this._setFilesArray = [];
    this._setSelectedNodeArray = [];

    this._loadFiles();
  }

  useSelectedNode() {
    let [selectedNode, setSelectedNode] = useState(this._selectedNode);

    useEffect(() => {
      this._setSelectedNodeArray.push(setSelectedNode);
      if (selectedNode !== this._selectedNode) {
        setSelectedNode(this._selectedNode);
      }

      return () => {
        this._setSelectedNodeArray = this._setSelectedNodeArray.filter(
          (fn) => fn !== setSelectedNode,
        );
      };
    }, []);

    return selectedNode;
  }

  selectNode(node) {
    this._selectedNode = node;
    this._setSelectedNodeArray.forEach((setSelectedNode) => {
      setSelectedNode(node);
    });
  }

  useFiles() {
    let [files, setFiles] = useState({
      isPending: !this._files,
      files: this._files,
    });

    useEffect(() => {
      this._setFilesArray.push(setFiles);
      if (files !== this._files) {
        setFiles({ isPending: !this._files, files: this._files });
      }

      return () => {
        this._setFilesArray = this._setFilesArray.filter(
          (fn) => fn !== setFiles,
        );
      };
    }, []);

    return files;
  }

  _setFiles(files) {
    this._files = files;
    this._setFilesArray.forEach((setFiles) => {
      setFiles({ isPending: false, files: this._files });
    });
  }

  async _loadFiles() {
    let files = await functionClient.getFunction("parseDirectory")();

    if (
      files.children.filter(({ name }) => name === "catalyst.json").length === 1
    ) {
      let readFile = functionClient.getFunction("readFile");
      this.config = JSON.parse(await readFile("catalyst.json"));
    } else {
      this.config = {
        nodes: {},
      };

      await this.writeConfig();
    }

    console.log(this.config);

    let traverse = (nodeData) => {
      let node;
      switch (nodeData.type) {
        case "directory":
          let children = nodeData.children.map(traverse);
          node = new Directory(nodeData.name, nodeData.path, children);
          break;
        case "file":
          node = new File(nodeData.name, nodeData.path, this);
          break;
      }

      return node;
    };

    this._setFiles(traverse(files));
  }

  async writeConfig() {
    console.log(this.config);
    let writeFile = functionClient.getFunction("writeFile");
    await writeFile("catalyst.json", JSON.stringify(this.config, null, 4));
  }
}

const ProjectContext = createContext();

export function ProjectContextProvider({ project, children }) {
  return (
    <ProjectContext.Provider value={project}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
