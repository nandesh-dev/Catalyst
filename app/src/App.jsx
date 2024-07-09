import { Files, TreeEditor } from "./components";

export function App() {
  return (
    <div className="h-dvh flex gap-m bg-slate-950 p-m overflow-hidden">
      <section className="w-80 grid grid-rows-[1fr_auto_1fr] gap-xl bg-slate-800 rounded-l p-xl overflow-hidden">
        <TreeEditor />
        <div className="h-[2px] rounded-m bg-slate-600" />
        <Files />
      </section>
    </div>
  );
}
