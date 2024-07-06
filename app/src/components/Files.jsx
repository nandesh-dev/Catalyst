import { useState } from "react";

import { useProject } from "../class/Project.jsx";
import * as Class from "../class/File.jsx";

export function Files() {
  const { isPending, files } = useProject().useFiles();

  return (
    <div>
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Directory directory={files} />
        </div>
      )}
    </div>
  );
}

function Directory({ directory }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <p onClick={() => setIsOpen(!isOpen)}>
        {(isOpen ? "▼ " : "▶ ") + directory.name}
      </p>
      {isOpen && (
        <div className="pl-4">
          {directory.children.map((child) => {
            if (child instanceof Class.File) {
              return <File key={child.path} file={child} />;
            }

            return <Directory key={child.path} directory={child} />;
          })}
        </div>
      )}
    </div>
  );
}

function File({ file }) {
  const [isOpen, setIsOpen] = useState(false);
  let nodes = file.useNodes();
  return (
    <div>
      <p onClick={() => setIsOpen(!isOpen)}>
        {(isOpen ? "== " : "|| ") + file.name}
      </p>
      {isOpen && (
        <div className="pl-4">
          {nodes.map((node) => {
            return <Node key={node.name} node={node} />;
          })}
        </div>
      )}
    </div>
  );
}

function Node({ node }) {
  let project = useProject();
  return (
    <div>
      <button
        onClick={() => {
          project.selectNode(node);
        }}
      >
        {node.name}
      </button>
    </div>
  );
}
