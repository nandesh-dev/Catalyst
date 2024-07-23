import { ServerProvider } from "./class/server";
import { FileSystem, HtmlEditor, Renderer } from "./components";

export function App() {
  return (
    <div className="flex overflow-hidden h-dvh gap-m bg-slate-950 p-m">
      <ServerProvider>
        <section className="absolute top-0 left-0">
          <Renderer />
        </section>
        <section className="grid overflow-hidden z-50 w-80 rounded-l grid-rows-[1fr_auto_1fr] gap-xl bg-slate-800 p-xl">
          <HtmlEditor />
          <div className="h-[2px] rounded-m bg-slate-600" />
          <FileSystem />
        </section>
      </ServerProvider>
    </div>
  );
}
