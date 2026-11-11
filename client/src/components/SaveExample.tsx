import { useState } from "react";
import { DynamicButton } from "@/components/DynamicButton";

const labels = { idle: "Save", saving: "Saving…", saved: "Saved" } as const;

export function SaveExample() {
  const [state, setState] = useState<keyof typeof labels>("idle");

  function handleSave() {
    setState("saving");
    setTimeout(() => setState("saved"), 1000);
  }

  return (
    <DynamicButton
      label={labels[state]}
      stateKey={state}
      onClick={handleSave}
      disabled={state === "saving"}
    />
  );
}
