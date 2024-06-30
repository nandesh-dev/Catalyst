import * as fs from "fs/promises";

export async function readFile(path) {
  return await fs.readFile(path, "utf-8");
}
