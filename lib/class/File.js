import fs from "fs";
import path from "path";

import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as BabelTypes from "@babel/types";

import { Node } from "./Node.js";
import { Config } from "./Config.js";
import { generateRandomID, registerID } from "../utils/id.js";

export class File {
  /**
   * @param filePath string
   * @param config {Config}
   */
  constructor(filePath, config) {
    /**
     * @private
     * @type string
     */
    this.path = filePath;

    /**
     * @private
     * @type {Config}
     */
    this.config = config;

    /**
     * @private
     * @type string
     */
    this.name = path.basename(filePath);

    /**
     * @private
     * @type string
     */
    this.content = "";

    /**
     * @type {(Node)[]}
     */
    this.nodes = [];

    /**
     * @type {BabelTypes.Program|undefined}
     */
    this.ast;
  }

  /**
   * Extracts parent JSX nodes from file.
   */
  extractParentJSXNodes() {
    if (!this.name.endsWith(".jsx")) return;
    this.content = fs.readFileSync(this.path, "utf-8");

    this.ast = parse(this.content, {
      sourceType: "module",
      plugins: ["jsx"],
      attachComment: true,
    });

    this.nodes = [];

    traverse.default(this.ast, {
      enter: (currentPath) => {
        let { node, parentPath } = currentPath;

        if (node.type === "JSXElement" || node.type === "JSXText") {
          if (
            !BabelTypes.isJSXText(parentPath) &&
            !BabelTypes.isJSXElement(parentPath)
          ) {
            let id = node.leadingComments
              ?.filter(({ value }) => value.startsWith("cat"))[0]
              ?.value.split(":")[1];

            if (!id) {
              id = generateRandomID();
              BabelTypes.addComment(node, "leading", `cat:${id}`);
            }

            registerID(id);

            this.nodes.push(new Node(id, node, this.config, this));
          }
        }
      },
    });

    let newContent = generate.default(this.ast, {}, this.content).code;
    if (newContent !== this.content) {
      fs.writeFileSync(this.path, newContent, "utf-8");
    }
    this.content = newContent;
  }

  /**
   * Generates content from ast and writes to the file
   */
  write() {
    this.content = generate.default(this.ast, {}, this.content).code;
    fs.writeFileSync(this.path, this.content, "utf-8");
  }

  /**
   * Returns a JSON representation of the file data
   * @returns {{path: string, name: string}}
   */
  toJSON() {
    return {
      path: this.path,
      name: this.name,
      type: "file",
      nodes: this.nodes.map((node) => {
        return { id: node.id, name: node.name, color: node.color };
      }),
    };
  }
}
