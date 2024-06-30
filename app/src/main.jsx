import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App.jsx";
import { Project, ProjectContextProvider } from "./class/Project.jsx";
import "./index.css";

const project = new Project();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProjectContextProvider project={project}>
      <App />
    </ProjectContextProvider>
  </React.StrictMode>,
);
