import { useState, useEffect } from "react";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as BabelTypes from "@babel/types";

import { Node } from "./Node";
import { functionClient } from "../functionClient";

export class File {
  constructor(name, path, project) {
    this.name = name;
    this.path = path;
    this._project = project;

    this._nodes = [];
    this._setNodesArray = [];

    this._parseFile();
  }

  useNodes() {
    let [nodes, setNodes] = useState(this._nodes);

    useEffect(() => {
      if (nodes !== this._nodes) {
        setNodes(this._nodes);
      }

      this._setNodesArray.push(setNodes);

      return () => {
        this._setNodesArray = this._setNodesArray.filter(
          (fn) => fn !== setNodes,
        );
      };
    }, []);

    return nodes;
  }

  _setNodes(nodes) {
    this._nodes = nodes;
    this._setNodesArray.forEach((setNodes) => {
      setNodes([...nodes]);
    });
  }

  async _parseFile() {
    if (this.name.split(".").at(-1) !== "jsx") return;
    const readFile = functionClient.getFunction("readFile");
    this._content = await readFile(this.path);

    this._ast = parse(this._content, {
      sourceType: "module",
      plugins: ["jsx"],
      attachComment: true,
    });

    traverse(this._ast, {
      enter: (e) => {
        let { node, parentPath } = e;

        const getParentFunctionPath = (parentPath) => {
          if (parentPath == null) {
            return null;
          } else if (parentPath.node.type === "FunctionDeclaration") {
            return parentPath;
          } else if (
            parentPath.node.type == "JSXElement" ||
            parentPath.node.type == "JSXText"
          ) {
            return;
          }

          return getParentFunctionPath(parentPath.parentPath);
        };

        if (node.type === "JSXElement" || node.type === "JSXText") {
          let parentFunctionPath = getParentFunctionPath(parentPath);

          if (parentFunctionPath !== undefined) {
            let uuid = node.leadingComments
              ?.filter(({ value }) => value.startsWith("Catalyst"))[0]
              ?.value.split(":")[1];

            if (!uuid) {
              uuid = window.crypto.randomUUID();
              BabelTypes.addComment(node, "leading", `Catalyst:${uuid}`);
            }

            this._nodes.push(
              new Node(uuid, e, parentFunctionPath, this._project),
            );
          }
        }
      },
    });

    this._content = generate(this._ast, {}, this._content).code;
    let writeFile = functionClient.getFunction("writeFile");
    await writeFile(this.path, this._content);

    this._setNodes(this._nodes);
  }
}
