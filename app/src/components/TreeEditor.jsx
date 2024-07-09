import { useRef } from "react";

import { HTMLColorMap } from "../constants/Colors";
import { useProject } from "../class";
import { Square } from "../assets";

export function TreeEditor() {
  let project = useProject();
  let selectedNode = project.useSelectedNode();

  return (
    <div className="grid gap-xl grid-rows-[auto_1fr] overflow-hidden">
      <div>
        <h3 className="text-l text-bright">Tree</h3>
      </div>
      <div className="overflow-scroll">
        {selectedNode && <HTMLTree node={selectedNode.path.node} />}
      </div>
    </div>
  );
}

function HTMLTree({ node }) {
  let outerRef = useRef();

  const onClick = () => {
    outerRef.current.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "center",
    });
  };

  switch (node.type) {
    case "JSXText":
      return;
    case "JSXElement":
      let elementTagName = node.openingElement.name.name;
      let colorCSS = HTMLColorMap[elementTagName];

      if (node.children.length === 0) {
        return (
          <button
            onClick={onClick}
            className="flex flex-row items-center gap-m"
            ref={outerRef}
          >
            <Square className="fill-red" style={{ fill: colorCSS }} />
            <p className="text-slate-100 text-nowrap">
              {`<${elementTagName}></${elementTagName}>`}
            </p>
          </button>
        );
      }

      if (node.children.length === 1) {
        let text = node.children[0].value;

        if (node.children[0].value.startsWith("\n")) {
          for (let char of node.children[0].value) {
            if (char !== " ") {
              return (
                <button
                  onClick={onClick}
                  className="flex flex-row items-center gap-m"
                  ref={outerRef}
                >
                  <Square className="fill-red" style={{ fill: colorCSS }} />
                  <p className="text-slate-100 text-nowrap">
                    {`<${elementTagName}>${text.split("\n")[1].trim().slice(0, 5)}${text.split("\n")[1].trim().length > 5 ? ".." : ""}</${elementTagName}>`}
                  </p>
                </button>
              );
            }
          }
          return (
            <button
              onClick={onClick}
              className="flex flex-row items-center gap-m text-nowrap"
              ref={outerRef}
            >
              <Square className="fill-red" style={{ fill: colorCSS }} />
              <p className="text-slate-100">
                {`<${elementTagName}></${elementTagName}>`}
              </p>
            </button>
          );
        }

        return (
          <button
            onClick={onClick}
            className="flex flex-row items-center gap-m"
            ref={outerRef}
          >
            <Square className="fill-red" style={{ fill: colorCSS }} />
            <p className="text-slate-100 text-nowrap">
              {`<${elementTagName}>${text.slice(0, 5)}${text.length > 5 ? ".." : ""}</${elementTagName}>`}
            </p>
          </button>
        );
      }

      return (
        <div>
          <button
            onClick={onClick}
            className="flex flex-row items-center gap-m"
            ref={outerRef}
          >
            <Square className="fill-red" style={{ fill: colorCSS }} />
            <p className="text-slate-100 text-nowrap">
              {"<" + node.openingElement.name.name + ">"}
            </p>
          </button>
          <div className="grid grid-cols-[auto_1fr] gap-m">
            <div className="h-full w-l flex justify-center ">
              <div
                className="h-full w-[2px] bg-red"
                style={{ backgroundColor: colorCSS }}
              />
            </div>
            <div className="">
              {node.children.map((childNode) => {
                return (
                  <HTMLTree key={window.crypto.randomUUID()} node={childNode} />
                );
              })}
            </div>
          </div>
          <button
            onClick={onClick}
            className="flex flex-row justify-between items-center text-nowrap"
          >
            <div className="flex flex-row items-center gap-m">
              <Square className="fill-red" style={{ fill: colorCSS }} />
              <p className="text-slate-100">
                {"</" + node.openingElement.name.name + ">"}
              </p>
            </div>
          </button>
        </div>
      );
    case "JSXExpressionContainer":
      return (
        <button
          className="flex flex-row gap-m items-center"
          onClick={onClick}
          ref={outerRef}
        >
          <Square className="fill-red" />
          <p className="text-slate-100" children="{}" />
        </button>
      );
  }
}
