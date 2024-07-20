import path from "path";
import { WebSocketServer } from "ws";

import { Args } from "./utils/arguments.js";
import { ConnectionManager } from "./class/ConnectionManager.js";
import { Connection } from "./class/Connection.js";
import { FileSystem } from "./class/FileSystem.js";

let fileSystem = new FileSystem(
  Args.path ? path.join(process.cwd(), Args.path) : process.cwd(),
);
let connectionManager = new ConnectionManager("multiple");

let wss = new WebSocketServer({
  port: Args.port || 3000,
});

wss.on("connection", (ws) => {
  let connection = new Connection(ws, fileSystem);
  connectionManager.addConnection(connection);
});
