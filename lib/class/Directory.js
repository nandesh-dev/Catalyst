import path from 'path'
import { File } from './File.js'

export class Directory {
  constructor(dirPath, children) {
    this.name = path.basename(dirPath)
    this.path = dirPath
    /**
     * @type {(Directory|File)[]}
     */
    this.children = children
  }

  toJSON() {
    return {
      name: this.name,
      path: this.path,
      type: "directory",
      children: this.children.map(child => child.toJSON())
    }
  }
}
