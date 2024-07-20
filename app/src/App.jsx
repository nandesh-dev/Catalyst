import { ServerProvider } from "./class/server";
import { FileSystem, HtmlEditor } from "./components";

export function App() {
  return (
    <div className="flex overflow-hidden h-dvh gap-m bg-slate-950 p-m">
      <section className="grid overflow-hidden w-80 rounded-l grid-rows-[1fr_auto_1fr] gap-xl bg-slate-800 p-xl">
        <ServerProvider>
          <HtmlEditor />
          <div className="h-[2px] rounded-m bg-slate-600" />
          <FileSystem />
        </ServerProvider>
      </section>
    </div>
  );
}
