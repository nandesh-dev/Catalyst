import { Files } from "./components/Files.jsx";
import { useProject } from "./class/Project.jsx";

export function App() {
  const selectedNode = useProject().useSelectedNode();

  return (
    <div className="">
      <Files />
      {selectedNode?.name}
    </div>
  );
}
