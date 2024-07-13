import * as fs from "fs/promises";
import path from "path";

export async function parseDirectory(dirPath) {
  if (!dirPath) dirPath = process.cwd();
  const stats = await fs.stat(dirPath);

  let info = {
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
          return (
            !ignorePatterns.includes(childRelativePath) &&
            !path.basename(childRelativePath).startsWith(".") //TODO Add option to dissable hidden files
          );
        })
        .map(
          async (childRelativePath) =>
            await parseDirectory(path.join(dirPath, childRelativePath)),
        ),
    );
  } else {
    info.type = "file";
  }

  let configExist =
    info.children?.filter(({ name }) => name === "catalyst.json").length === 1;

  info = {
    path: "/home/nandesh/Documents/Coding/Catalyst",
    name: "Catalyst",
    type: "directory",
    children: [
      {
        path: "/home/nandesh/Documents/Coding/Catalyst/test.jsx",
        name: "test.jsx",
        type: "file",
      },
      {
        path: "/home/nandesh/Documents/Coding/Catalyst/test2.jsx",
        name: "test2.jsx",
        type: "file",
      },
    ],
  };

  if (configExist) {
    info.children.push({
      path: "/home/nandesh/Documents/Coding/Catalyst/catalyst.json",
      name: "catalyst.json",
      type: "file",
    });
  }

  return info;
}
