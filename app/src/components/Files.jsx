import { useState } from "react";

import { useProject } from "../class/Project.jsx";
import { File as FileClass } from "../class/File";

export function Files() {
  const { isPending, files } = useProject().useFiles();

  return (
    <div>
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Directory name={files.name} children={files.children} />
        </div>
      )}
    </div>
  );
}

function Directory({ name, children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <p onClick={() => setIsOpen(!isOpen)}>{(isOpen ? "▼ " : "▶ ") + name}</p>
      {isOpen && (
        <div className="pl-4">
          {children.map((child) => {
            if (child instanceof FileClass) {
              return (
                <File key={child.path} name={child.name} path={child.path} />
              );
            }

            return (
              <Directory
                key={child.path}
                name={child.name}
                children={child.children}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function File({ name }) {
  return (
    <div>
      <p>{"|| " + name}</p>
    </div>
  );
}
