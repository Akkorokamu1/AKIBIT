import { DynamicButton } from "@/components/DynamicButton";
import { SaveExample } from "@/components/SaveExample";
import dynamicButtonSource from "@/components/DynamicButton.tsx?raw";
import saveExampleSource from "@/components/SaveExample.tsx?raw";

const sections = [
  {
    title: "Dynamic Button",
    description:
      "A button that resizes to fit its label and crossfades the text when the label changes.",
    demo: <DynamicButton label="Save" />,
    source: dynamicButtonSource,
  },
  {
    title: "Save Example",
    description: "The dynamic button wired to a save action with three states.",
    demo: <SaveExample />,
    source: saveExampleSource,
  },
];

export default function Components() {
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
          <pre className="overflow-x-auto rounded-xl bg-neutral-950 p-4 text-sm text-neutral-100">
            <code>{s.source}</code>
          </pre>
        </section>
      ))}
    </main>
  );
}
