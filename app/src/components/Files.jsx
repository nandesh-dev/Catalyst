import { useState, useRef } from "react";

import { useProject } from "../class/Project.jsx";
import * as Class from "../class/File.jsx";

import {
  Square,
  DownTriangle,
  RightTriangle,
  DownArrow,
  RightArrow,
} from "../assets";

import { Colors } from "../constants/Colors";

export function Files() {
  const { isPending, files } = useProject().useFiles();
  return (
    <div className="w-80 h-full grid grid-rows-[auto_1fr] bg-slate-800 rounded-l p-xl overflow-hidden">
      <div className="pb-xl">
        <h3 className="text-l text-bright">Files</h3>
      </div>
      <div className="h-full overflow-scroll pr-xl pb-xl">
        {!isPending && <Directory directory={files} level={0} />}
      </div>
    </div>
  );
}

const randomColor = () => {
  return Object.values(Colors.primary)[
    Math.round(Math.random() * (Object.values(Colors.primary).length - 1))
  ];
};

function Directory({ directory, level }) {
  const [isOpen, setIsOpen] = useState(false);
  let outerRef = useRef();

  return (
    <div className="w-fit flex flex-col gap-s" ref={outerRef}>
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
          {isOpen ? (
            <DownTriangle className="fill-slate-200" />
          ) : (
            <RightTriangle className="fill-slate-200" />
          )}
          <p className="text-slate-100">{directory.name}</p>
        </div>
      </button>
      {isOpen && (
        <div className="grid grid-cols-[auto_1fr] gap-m">
          <div className="flex justify-center w-l">
            <div className="h-full w-[2px] rounded-s bg-slate-200" />
          </div>
          <div className="w-full flex flex-col gap-s">
            {directory.children.map((child, index) => {
              if (child instanceof Class.File) {
                return <File key={child.path} file={child} />;
              }

              return (
                <Directory
                  key={child.path}
                  directory={child}
                  level={level + 1 + index}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function File({ file }) {
  if (!file.path.endsWith(".jsx")) return; //TODO
  let [isOpen, setIsOpen] = useState(false);
  let outerRef = useRef();
  let nodes = file.useNodes();

  return (
    <div className="w-fit flex flex-col gap-s" ref={outerRef}>
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
          {isOpen ? (
            <DownArrow className="fill-slate-200" />
          ) : (
            <RightArrow className="fill-slate-200" />
          )}
          <p className="text-slate-100">{file.name}</p>
        </div>
      </button>
      {isOpen && (
        <div className="grid grid-cols-[auto_1fr] gap-m">
          <div className="flex justify-center w-l">
            <div className="h-full w-[2px] rounded-s bg-slate-200" />
          </div>
          <div className="">
            {nodes.map((node) => {
              return <Node key={node.name} node={node} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Node({ node }) {
  let project = useProject();
  let [color] = useState(randomColor());
  let outerRef = useRef();

  return (
    <button
      ref={outerRef}
      onClick={() => {
        outerRef.current.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "center",
        });
        project.selectNode(node);
      }}
      className="flex flex-row gap-m items-center"
    >
      <Square style={{ fill: color }} />
      <p className="text-slate-100">{node.name}</p>
    </button>
  );
}
