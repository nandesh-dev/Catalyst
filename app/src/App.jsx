import { Files } from "./components/Files.jsx";
import { useProject } from "./class/Project.jsx";

export function App() {
  const selectedNode = useProject().useSelectedNode();

  return (
    <div className="h-dvh flex gap-m bg-slate-950 p-m overflow-hidden">
      <Files />
      {selectedNode?.name}
    </div>
  );
}
