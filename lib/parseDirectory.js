import * as fs from "fs/promises";
import path from "path";

export async function parseDirectory(dirPath) {
  if (!dirPath) dirPath = process.cwd();
  const stats = await fs.stat(dirPath);

  const info = {
    path: dirPath,
    name: path.basename(dirPath),
  };

  if (stats.isDirectory()) {
    info.type = "directory";
    let childrenDirectories = await fs.readdir(dirPath);

    //TODO Implement proper solution to ignore directories / files from gitignore
    let ignorePatterns = [];
    if (childrenDirectories.includes(".gitignore")) {
      ignorePatterns = (
        await fs.readFile(path.join(dirPath, ".gitignore"), "utf-8")
      )
        .split(/\r?\n/)
        .filter((line) => line && !line.startsWith("#"));
    }

    info.children = await Promise.all(
      childrenDirectories
        .filter((childRelativePath) => {
          return !ignorePatterns.includes(childRelativePath);
        })
        .map(
          async (childRelativePath) =>
            await parseDirectory(path.join(dirPath, childRelativePath)),
        ),
    );
  } else {
    info.type = "file";
  }

  return info;
}
