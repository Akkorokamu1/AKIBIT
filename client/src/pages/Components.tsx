import { useEffect, useState, type ReactNode } from "react";
import { DynamicButton } from "@/components/DynamicButton";
import { SaveExample } from "@/components/SaveExample";

type Section = {
  title: string;
  description: string;
  demo: ReactNode;
  source: string | null;
};

// Source text is loaded with a dynamic import so the server renderer
// never evaluates the Vite-only "?raw" import.
function useSources() {
  const [sources, setSources] = useState<{ button: string; save: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      import("@/components/DynamicButton.tsx?raw"),
      import("@/components/SaveExample.tsx?raw"),
    ]).then(([button, save]) => {
      if (!cancelled) setSources({ button: button.default, save: save.default });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return sources;
}

export default function Components() {
  const sources = useSources();

  const sections: Section[] = [
    {
      title: "Dynamic Button",
      description:
        "A button that resizes to fit its label and crossfades the text when the label changes.",
      demo: <DynamicButton label="Save" />,
      source: sources?.button ?? null,
    },
    {
      title: "Save Example",
      description: "The dynamic button wired to a save action with three states.",
      demo: <SaveExample />,
      source: sources?.save ?? null,
    },
  ];

  return (
    <main className="mx-auto max-w-3xl space-y-16 px-6 py-16">
      <h1 className="text-3xl font-semibold">Components</h1>
      {sections.map((s) => (
        <section key={s.title} className="space-y-4">
          <h2 className="text-xl font-semibold">{s.title}</h2>
          <p className="text-neutral-600">{s.description}</p>
          <div className="flex min-h-32 items-center justify-center rounded-xl border p-8">
            {s.demo}
          </div>
          {s.source !== null && (
            <pre className="overflow-x-auto rounded-xl bg-neutral-950 p-4 text-sm text-neutral-100">
              <code>{s.source}</code>
            </pre>
          )}
        </section>
      ))}
    </main>
  );
}
