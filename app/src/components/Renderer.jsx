import { createElement, useEffect, useRef } from "react";
import { useServer } from "../class/server";
import { useComputedColors } from "../constants/Colors";
import { useDimentions } from "../constants/Dimensions";

export function Renderer() {
  let backgroundCanvasRef = useRef();

  let colors = useComputedColors();
  let dimentions = useDimentions();
  let server = useServer();
  let [selectedNode] = server.useSelectedNodeState();

  useEffect(() => {
    /**
     * @type {HTMLCanvasElement|undefined}
     */
    let backgroundCanvas = backgroundCanvasRef.current;
    if (!backgroundCanvas) return;

    /**
     * @type {CanvasRenderingContext2D}
     */
    let backgroundCtx = backgroundCanvas.getContext("2d");

    backgroundCanvas.height = dimentions.height;
    backgroundCanvas.width = dimentions.width;

    let drawGrid = (gap, radius) => {
      for (let y = 0; y <= dimentions.height; y += gap) {
        for (let x = 0; x <= dimentions.width; x += gap) {
          backgroundCtx.beginPath();
          backgroundCtx.moveTo(x, y);
          backgroundCtx.arc(x, y, radius, 0, Math.PI * 2);
          backgroundCtx.fillStyle = colors.secondary.slate[900];
          backgroundCtx.fill();
        }
      }
    };

    drawGrid(40, 2);
  }, [colors, dimentions]);

  return (
    <div className="flex justify-center items-center w-screen h-dvh">
      <canvas className="absolute top-0 left-0" ref={backgroundCanvasRef} />
      <div
        className="absolute outline-slate-600 outline-4 hover:outline"
        style={{ height: 500, width: 400 }}
      >
        {selectedNode && <Element element={selectedNode.html} />}
      </div>
    </div>
  );
}

function Element({ element }) {
  switch (element.type) {
    case "custom":
      return;
    case "expression":
      return;
    case "text":
      return element.value;
    default:
      return createElement(
        element.type,
        {},
        element.children.map((childElement) => {
          return <Element element={childElement} />;
        }),
      );
  }
}
