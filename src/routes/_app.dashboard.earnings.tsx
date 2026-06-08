import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard/earnings")({
  head: () => ({ meta: [{ title: "Earnings — KOSMO" }] }),
  component: EarningsPage,
});

function EarningsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Earnings</h1>
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-muted-foreground">Your earnings summary will appear here.</p>
        <p className="mt-3 text-sm text-muted-foreground">Track revenue from your uploaded assets.</p>
      </div>
    </div>
  );
}
