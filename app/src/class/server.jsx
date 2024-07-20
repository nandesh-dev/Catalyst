import { useState, useEffect, createContext, useContext } from "react";

const ServerContext = createContext();

class MultiLocationState {
  constructor(initialData) {
    /**
     * @private
     */
    this.data = initialData;
    /**
     * @private
     */
    this.setStates = [];
  }

  setState(data) {
    this.data = data;
    this.setStates.forEach((setState) => {
      setState(data);
    });
  }

  useState() {
    let [state, setState] = useState(this.data);

    useEffect(() => {
      if (state !== this.data) setState(this.data);
      this.setStates.push(setState);

      return () => {
        this.setStates = this.setStates.filter((fn) => fn !== setState);
      };
    });

    return [state, this.setState];
  }
}

class Server {
  constructor() {
    /**
     * @private
     */
    this.ws = new WebSocket("ws://localhost:3000");

    this.ws.onmessage = (msg) => this.onmessage(msg);

    /**
     * @private
     */
    this.states = {
      fileSystem: new MultiLocationState(),
      selectedNode: new MultiLocationState(),
    };
  }

  /**
   * @private
   */
  onmessage({ data: msg }) {
    let { op, data } = JSON.parse(msg);
    console.info("onmessage", op, data);

    switch (op) {
      case 0:
        this.states.fileSystem.setState(data);
        break;
      case 2:
        this.states.selectedNode.setState(data);
        break;
    }
  }

  useFileSystemState() {
    return this.states.fileSystem.useState();
  }

  useSelectedNodeState() {
    return this.states.selectedNode.useState();
  }

  updateNodeName(id, name) {
    this.send(1, { id, name });
  }

  selectNode(id) {
    this.send(2, { id });
  }

  send(op, data) {
    this.ws.send(
      JSON.stringify({
        op,
        data,
      }),
    );
  }
}

const server = new Server();

export function ServerProvider({ children }) {
  return (
    <ServerContext.Provider value={server}>{children}</ServerContext.Provider>
  );
}

/**
 * @returns {Server}
 */
export const useServer = () => {
  return useContext(ServerContext);
};
