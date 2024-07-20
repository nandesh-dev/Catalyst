import * as BabelTypes from "@babel/types";

import { isHTMLElement } from "../utils/isHTMLElement.js";
import { Config } from "./Config.js";
import { File } from "./File.js";
import { Colors, generateRandomColor } from "../constants/Colors.js";
import { generateRandomID, registerID } from "../utils/id.js";

export class Node {
  /**
   * @param id string
   * @param node {BabelTypes.JSXElement|BabelTypes.JSXText}
   * @param config {Config}
   * @param file {File}
   */
  constructor(id, node, config, file) {
    /**
     * @type string
     */
    this.id = id;

    /**
     * @type {BabelTypes.JSXElement|BabelTypes.JSXText}
     */
    this.node = node;

    /**
     * @private
     * @type {Config}
     */
    this.config = config;

    /**
     * @private
     * @type {File}
     */
    this.file = file;

    if (!this.config.data.nodes[this.id]) {
      this.config.data.nodes[this.id] = {};
      this.config.write();
    }

    if (!this.config.data.nodes[this.id].name) {
      this.config.data.nodes[this.id].name = "Node";
      this.config.write();
    }

    if (!this.config.data.nodes[this.id].color) {
      this.config.data.nodes[this.id].color = generateRandomColor();
      this.config.write();
    }

    if (!this.config.data.nodes[this.id].expressions) {
      this.config.data.nodes[this.id].expressions = {};
      this.config.write();
    }

    /**
     * @type string
     */
    this.name = this.config.data.nodes[this.id].name;

    /**
     * @type string
     */
    this.color = this.config.data.nodes[this.id].color;

    this.html = this.extractHTML(this.node);
  }

  /**
   * @private
   * @param node {BabelTypes.JSXElement|BabelTypes.JSXText|BabelTypes.JSXExpressionContainer}
   */
  extractHTML(node) {
    let data = {
      id: generateRandomID(),
    };

    if (BabelTypes.isJSXElement(node)) {
      if (isHTMLElement(node)) {
        data.type = node.openingElement.name.name;
      } else {
        data.type = "custom";
        data.value = node.openingElement.name.name;
      }

      data.children = node.children
        .filter((childNode) => {
          if (
            !BabelTypes.isJSXText(childNode) &&
            !BabelTypes.isJSXElement(childNode) &&
            !BabelTypes.isJSXExpressionContainer(childNode)
          )
            return false;

          if (
            BabelTypes.isJSXText(childNode) &&
            childNode.value.startsWith("\n") &&
            childNode.value.trim().slice(1).length == 0
          )
            return false;

          return true;
        })
        .map((childNode) => this.extractHTML(childNode));
    } else if (BabelTypes.isJSXText(node)) {
      data.type = "text";
      data.value = node.value; //TODO Remove newline from value
    } else {
      let id = node.expression.leadingComments
        ?.filter(({ value }) => value.startsWith("cat"))[0]
        ?.value.split(":")[1];

      if (!id) {
        id = generateRandomID();
        BabelTypes.addComment(node.expression, "leading", `cat:${id}`);
        this.file.write();
      }

      registerID(id);

      if (typeof this.config.data.nodes[this.id].expressions[id] !== "string") {
        this.config.data.nodes[this.id].expressions[id] = null;
        this.config.write();
      }

      data.id = id;
      data.type = "expression";
    }

    return data;
  }

  toJSON() {
    return {
      html: this.html,
      id: this.id,
      name: this.name,
      color: this.config.data.nodes[this.id].color,
      expressions: this.config.data.nodes[this.id].expressions,
    };
  }
}
