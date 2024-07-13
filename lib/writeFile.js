import * as fs from "fs/promises";

export async function writeFile(path, content) {
  return await fs.writeFile(path, content, "utf-8");
}
