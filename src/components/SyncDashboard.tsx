"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Database,
  LoaderCircle,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";

type Stats = {
  created: number;
  updated: number;
  unchanged: number;
  skipped: number;
  errors: number;
};
type SyncEvent = {
  type: "status" | "progress" | "complete" | "error";
  message?: string;
  completed?: number;
  total?: number;
  item?: string;
  stats?: Stats;
};
const initialStats: Stats = {
  created: 0,
  updated: 0,
  unchanged: 0,
  skipped: 0,
  errors: 0,
};

export default function SyncDashboard() {
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState(
    "Listo para sincronizar la value list.",
  );
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [finished, setFinished] = useState(false);
  const [failed, setFailed] = useState(false);
  const sync = async () => {
    setRunning(true);
    setFinished(false);
    setFailed(false);
    setProgress(0);
    setStats(initialStats);
    try {
      const response = await fetch("/api/sync");
      if (!response.body)
        throw new Error("No se recibió progreso del servidor.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const raw of events) {
          if (!raw.startsWith("data: ")) continue;
          const event = JSON.parse(raw.slice(6)) as SyncEvent;
          if (event.message) setMessage(event.message);
          if (event.stats) setStats(event.stats);
          if (event.total && event.completed !== undefined)
            setProgress(Math.round((event.completed / event.total) * 100));
          if (event.type === "complete") setFinished(true);
          if (event.type === "error") setFailed(true);
        }
      }
    } catch {
      setFailed(true);
      setMessage("La conexión con la sincronización se interrumpió.");
    } finally {
      setRunning(false);
    }
  };
  const cards = [
    ["Creados", stats.created],
    ["Actualizados", stats.updated],
    ["Sin cambios", stats.unchanged],
    ["Omitidos", stats.skipped],
    ["Errores", stats.errors],
  ];
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 pt-24 pb-10 md:px-8">
      <section className="rounded-(--radius-lg) border border-(--accentMain) bg-(--backgroundComparator)/72 p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-bold tracking-[.25em] text-(--accentBright) uppercase">
              Administración · AOTR Value Lab
            </p>
            <h1 className="mt-2 text-3xl font-black text-(--textHighlight)">
              Sincronizar Value List
            </h1>
            <p className="mt-2 max-w-xl text-(--textSecondary)">
              Importa los datos de la hoja oficial y conserva un historial
              cuando el precio de un ítem cambia.
            </p>
          </div>
          <button
            type="button"
            disabled={running}
            onClick={sync}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-(--accentBright) bg-(--accentMain) px-5 py-3 font-bold text-(--textHighlight) disabled:cursor-not-allowed disabled:opacity-60"
          >
            {running ? (
              <LoaderCircle className="animate-spin" size={17} />
            ) : (
              <RefreshCw size={17} />
            )}
            {running ? "Sincronizando…" : "Iniciar sync"}
          </button>
        </div>
        <div className="mt-8 rounded-(--radius-md) border border-(--accentMain)/65 bg-black/15 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-(--textHighlight)">
              {failed ? (
                <TriangleAlert className="text-red-300" size={19} />
              ) : finished ? (
                <CheckCircle2 className="text-emerald-300" size={19} />
              ) : (
                <Database className="text-(--accentBright)" size={19} />
              )}
              <span className="text-sm font-semibold">{message}</span>
            </div>
            <span className="text-xl font-black text-(--accentBright)">
              {progress}%
            </span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full border border-(--accentMain)/65 bg-black/35">
            <div
              className={`h-full rounded-full transition-[width] duration-300 ${failed ? "bg-red-400" : finished ? "bg-emerald-400" : "bg-(--accentBright)"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {cards.map(([label, count]) => (
            <div
              key={String(label)}
              className="rounded-md border border-(--accentMain)/50 bg-black/15 p-3 text-center"
            >
              <p className="text-2xl font-black text-(--textHighlight)">
                {count}
              </p>
              <p className="mt-1 text-[10px] font-bold tracking-wider text-(--textSecondary) uppercase">
                {label}
              </p>
            </div>
          ))}
        </div>
        {finished && (
          <p className="mt-5 rounded-md border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            La sincronización terminó. Los cambios de precio quedaron
            registrados para las gráficas del Price Hub.
          </p>
        )}
      </section>
    </main>
  );
}
