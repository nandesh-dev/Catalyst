import { useRef } from "react";

import { HTMLColorMap } from "../constants/Colors";
import { Square } from "../assets";
import { useServer } from "../class/server";

export function HtmlEditor() {
  let server = useServer();
  let [selectedNode] = server.useSelectedNodeState();

  return (
    <div className="grid overflow-hidden gap-xl grid-rows-[auto_1fr]">
      <div>
        <h3 className="text-l text-bright">Tree</h3>
      </div>
      <div className="overflow-scroll">
        {selectedNode && <HtmlTree element={selectedNode.html} />}
      </div>
    </div>
  );
}

function HtmlTree({ element }) {
  let outerRef = useRef();

  const onClick = () => {
    outerRef.current.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "center",
    });
  };

  switch (element.type) {
    case "custom":
      return (
        <button
          className="flex flex-row items-center gap-m"
          onClick={onClick}
          ref={outerRef}
        >
          <Square className="fill-red" />
          <p className="text-slate-100" children="{}" />
        </button>
      );
    case "expression":
      return (
        <button
          className="flex flex-row items-center gap-m"
          onClick={onClick}
          ref={outerRef}
        >
          <Square className="fill-red" />
          <p className="text-slate-100" children="{}" />
        </button>
      );
    case "text":
      break;
    default:
      let color = HTMLColorMap[element.type];

      if (element.children.length === 0) {
        return (
          <button
            onClick={onClick}
            className="flex flex-row items-center gap-m"
            ref={outerRef}
          >
            <Square className="fill-red" style={{ fill: color }} />
            <p className="text-slate-100 text-nowrap">
              {`<${element.type}></${element.type}>`}
            </p>
          </button>
        );
      }

      if (
        element.children.length === 1 &&
        element.children[0].type === "text"
      ) {
        let text = element.children[0].value;
        return (
          <button
            onClick={onClick}
            className="flex flex-row items-center gap-m"
            ref={outerRef}
          >
            <Square className="fill-red" style={{ fill: color }} />
            <p className="text-slate-100 text-nowrap">
              {`<${element.type}>${text.slice(0, 5)}${text.length > 5 ? ".." : ""}</${element.type}>`}
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
            <Square className="fill-red" style={{ fill: color }} />
            <p className="text-slate-100 text-nowrap">
              {"<" + element.type + ">"}
            </p>
          </button>
          <div className="grid grid-cols-[auto_1fr] gap-m">
            <div className="flex justify-center h-full w-l">
              <div
                className="h-full w-[2px] bg-red"
                style={{ backgroundColor: color }}
              />
            </div>
            <div className="">
              {element.children.map((childElement) => {
                return (
                  <HtmlTree key={childElement.id} element={childElement} />
                );
              })}
            </div>
          </div>
          <button
            onClick={onClick}
            className="flex flex-row justify-between items-center text-nowrap"
          >
            <div className="flex flex-row items-center gap-m">
              <Square className="fill-red" style={{ fill: color }} />
              <p className="text-slate-100">{"</" + element.type + ">"}</p>
            </div>
          </button>
        </div>
      );
  }
}
