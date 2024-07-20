/*import { Connection } from './Connection'*/

export class ConnectionManager {
  /**
   * @param mode "single" | "multiple"
   */
  constructor(mode) {
    /**
     * Represents the mode of connection management
     * @private @readonly "single" | "multiple"
     */
    this.mode = mode;

    /**
     * @private
     * @type {(Connection)[]}
     */
    this.connections = [];
  }

  addConnection(connection) {
    if (this.mode === "single" && this.connections.length > 0) {
      for (let connection of this.connections) {
        connection.kill();
      }
    }

    this.connections.push(connection);
  }
}
