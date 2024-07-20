import { FileSystem } from "./FileSystem.js";

export class Connection {
  /**
   * Represents a connection
   * @param ws {WebSocket}
   */
  constructor(ws, fileSystem) {
    /**
     * @private
     * @type {WebSocket}
     */
    this.ws = ws;

    /**
     * @private
     * @type {FileSystem}
     */
    this.fileSystem = fileSystem;

    this.fileSystem.addUpdateListener(() => {
      this.sendDirectory();
    });

    this.sendInitialData();

    /**
     * @private
     * @type {string|null}
     */
    this.selectedNodeId = null;

    this.ws.onmessage = (msg) => {
      /**
       * @type{{ op: number, data: any }}
       */
      let data;

      try {
        data = JSON.parse(msg.data);
      } catch {
        this.kill();
      }

      switch (data.op) {
        case 0:
          this.sendDirectory();
          break;
        case 1:
          this.fileSystem.updateNodeName(data.data.id, data.data.name);
          break;
        case 2:
          this.selectedNodeId = data.data.id;
          this.sendSelectedNodeData();
        default:
          console.log(data);
      }
    };
  }

  /**
   * Kills the websocket connection
   */
  kill() {
    this.ws.close();
  }

  /**
   * @private
   */
  sendInitialData() {
    this.sendDirectory();
  }

  /**
   * @private
   */
  sendSelectedNodeData() {
    if (!this.selectedNodeId) return;
    let node = this.fileSystem.findNode(this.selectedNodeId);

    this.send(2, node);
  }

  /**
   * @private
   */
  sendDirectory() {
    this.send(0, this.fileSystem.directory);
  }

  /**
   * @private
   */
  send(op, data) {
    this.ws.send(
      JSON.stringify({
        op,
        data,
      }),
    );
  }
}
