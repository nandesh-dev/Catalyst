import { useState, useRef } from "react";
import { useServer } from "../class/server";

import {
  Square,
  DownTriangle,
  RightTriangle,
  DownArrow,
  RightArrow,
} from "../assets";

import { Colors } from "../constants/Colors";

export function FileSystem() {
  let server = useServer();
  let [fileSystem] = server.useFileSystemState();

  if (!fileSystem) return;

  return <Directory directory={fileSystem} />;
}

function Directory({ directory }) {
  const [isOpen, setIsOpen] = useState(true);
  let outerRef = useRef();

  return (
    <div className="flex flex-col w-fit gap-s" ref={outerRef}>
      <button
        onClick={() => {
          outerRef.current.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "center",
          });
          setIsOpen(!isOpen);
        }}
        className="flex flex-row justify-between items-center"
      >
        <div className="flex flex-row items-center gap-m">
          {directory.type == "directory" &&
            (isOpen ? (
              <DownTriangle className="fill-slate-200" />
            ) : (
              <RightTriangle className="fill-slate-200" />
            ))}
          {directory.type == "file" &&
            (isOpen ? (
              <DownArrow className="fill-slate-200" />
            ) : (
              <RightArrow className="fill-slate-200" />
            ))}
          <p className="text-slate-100">{directory.name}</p>
        </div>
      </button>
      {isOpen && (
        <div className="grid grid-cols-[auto_1fr] gap-m">
          <div className="flex justify-center w-l">
            <div className="h-full w-[2px] rounded-s bg-slate-200" />
          </div>
          <div className="flex flex-col w-full gap-s">
            {directory.children?.map((child) => {
              return <Directory key={child.path} directory={child} />;
            })}
            {directory.nodes?.map((node) => {
              return <Node key={node.id} node={node} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Node({ node }) {
  let server = useServer();

  return (
    <div className="flex flex-row items-center gap-m">
      <button
        onClick={() => {
          server.selectNode(node.id);
        }}
      >
        <Square style={{ fill: Colors.primary[node.color] }} />
      </button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          let formData = new FormData(e.target);
          let newName = formData.get("name");

          server.updateNodeName(node.id, newName);
        }}
      >
        <input
          className="text-slate-100"
          name="name"
          defaultValue={node.name}
        />
      </form>
    </div>
  );
}
