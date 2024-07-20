import fs from "fs";
import path from "path";
import Ignore from "ignore";

import { File } from "./File.js";
import { Directory } from "./Directory.js";
import { Config } from "./Config.js";
import { Node } from "./Node.js";

export class FileSystem {
  /**
   * @param basePath string
   */
  constructor(basePath) {
    /**
     * @private
     * @type string
     */
    this.path = basePath;

    /**
     * @private
     * @type {(function)[]}
     */
    this.updateListeners = [];

    /**
     * @type {Config}
     */
    this.config;

    /**
     * @type {Directory}
     */
    this.directory = this.parseFileSystem();

    if (!this.config) {
      this.config = new Config(path.join(this.path, "catalyst-lock.yaml"));
      this.config.write();
    }

    this.parseNodes();

    /**
     * @private
     * @type {Timeout|null}
     */
    this.updateTimeout = null;

    fs.watch(this.path, () => {
      if (this.updateTimeout) clearTimeout(this.updateTimeout);

      this.updateTimeout = setTimeout(() => {
        try {
          this.directory = this.parseFileSystem();
          for (let updateListener of this.updateListeners) {
            updateListener();
          }
        } catch {}
      }, 500);
    });
  }

  /**
   * @param listener function
   */
  addUpdateListener(listener) {
    this.updateListeners.push(listener);
  }

  updateNodeName(id, name) {
    this.config.data.nodes[id].name = name;
    this.config.write();

    let node = this.findNode(id);
    node.name = name;
  }

  /**
   * @param {string} id
   * @returns {Node|undefined}
   */
  findNode(id) {
    const traverse = (dir) => {
      if (dir instanceof Directory) {
        return dir.children
          .map((child) => traverse(child))
          .filter((node) => node)[0];
      }

      if (dir instanceof File) {
        return dir.nodes.filter((node) => node.id === id)[0];
      }

      return;
    };

    return traverse(this.directory);
  }

  /**
   * Parse the filesystem while trying to make least changes to the old filetree
   * @param oldDirectory {Directory|File|undefined}
   */
  parseFileSystem(dirPath, oldDirectory = this.directory) {
    if (!dirPath) dirPath = this.path;
    const stats = fs.statSync(dirPath);

    if (stats.isDirectory()) {
      let childrenDirectory = fs.readdirSync(dirPath);

      let ignore = Ignore();
      ignore.add([".*"]);

      if (fs.existsSync(path.join(dirPath, ".gitignore"))) {
        const gitIgnoreContent = fs.readFileSync(
          path.join(dirPath, ".gitignore"),
          "utf8",
        );
        ignore.add(gitIgnoreContent);
      }

      let children = childrenDirectory
        .filter(ignore.createFilter())
        .map((childRelativePath) => {
          let childPath = path.join(dirPath, childRelativePath);
          let oldChildDirectory = oldDirectory?.children.filter(
            (child) => child.path === childPath,
          )[0];

          if (
            !this.config &&
            path.basename(childRelativePath) === "catalyst-lock.yaml"
          ) {
            this.config = new Config(childPath);
          }

          return this.parseFileSystem(
            path.join(dirPath, childRelativePath),
            oldChildDirectory,
          );
        });

      return new Directory(dirPath, children);
    } else {
      if (oldDirectory instanceof File) {
        return oldDirectory;
      }
      return new File(dirPath, this.config);
    }
  }

  parseNodes() {
    const traverse = (dir) => {
      if (dir instanceof Directory) {
        dir.children.forEach((child) => traverse(child));
      } else if (dir instanceof File) {
        dir.extractParentJSXNodes();
      }
    };

    traverse(this.directory);
  }
}
