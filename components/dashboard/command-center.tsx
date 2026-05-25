"use client";

import { useState, useTransition } from "react";

const defaultPrompt = "Zbuduj generator polityki prywatności dla sklepów Web3";

export function CommandCenter() {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [message, setMessage] = useState("Ready to queue a new build.");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      setMessage("Queueing project...");

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          templateType: "tool",
          pricing: {
            amount: "1.00",
            currency: "USDC",
            unitLabel: "1 generation"
          }
        })
      });

      if (!response.ok) {
        setMessage("Project creation failed.");
        return;
      }

      const data = (await response.json()) as {
        project: { name: string; status: string };
      };

      setMessage(`Queued ${data.project.name} in stage ${data.project.status}.`);
    });
  }

  return (
    <form
      className="rounded-[28px] border border-offwhite/10 bg-charcoal-900/60 p-6 backdrop-blur-xl"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-offwhite-faint">
          Command Center
        </p>
        <span className="inline-flex items-center gap-2 rounded-full bg-aqua/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-aqua">
          <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
          decision-first
        </span>
      </div>
      <textarea
        className="mt-4 min-h-32 w-full resize-none rounded-[20px] border border-offwhite/10 bg-charcoal-950/60 px-5 py-4 text-base text-offwhite outline-none transition-colors duration-200 placeholder:text-offwhite-faint focus:border-violet/50 focus-visible:ring-2 focus-visible:ring-violet/40"
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Zbuduj generator polityki prywatności dla sklepów Web3..."
        value={prompt}
      />
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          className="rounded-full bg-violet px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-violet/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Queueing..." : "Create Project"}
        </button>
        <p className="text-sm text-offwhite-muted">{message}</p>
      </div>
    </form>
  );
}
