import express from "express";
import * as FnSync from "fn-sync/server";
import { parseDirectory } from "./parseDirectory.js";
import { readFile } from "./readFile.js";

const PORT = 3000;

let app = new express();
let fnSync = new FnSync.Server();

fnSync.registerFunction(parseDirectory);
fnSync.registerFunction(readFile);

app.use(express.static("public"));
app.use("/api", fnSync.useExpressRouter());

app.listen(PORT);
