import yaml from 'js-yaml'
import fs from 'fs'

export class Config {
  /**
   * @param path string
   */
  constructor(path) {
    /**
     * @private
     * @type string
     */
    this.path = path

    /**
     * @type {{
     *    nodes: {
     *      [key: string]: {
     *        name: string,
     *        color: string,
     *        expressions: {
     *          [key: string]: string
     *        }
     *      }
     *    }
     * }}
     */
    this.data = { nodes: {} }

    this.load()
  }

  load() {
    let content = fs.readFileSync(this.path)
    this.data = yaml.load(content)
  }

  write() {
    let content = yaml.dump(this.data)
    fs.writeFileSync(this.path, content)
  }
}
