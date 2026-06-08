import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard/purchases")({
  head: () => ({ meta: [{ title: "Purchases — KOSMO" }] }),
  component: PurchasesPage,
});

function PurchasesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Purchases</h1>
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-muted-foreground">This page is available for your purchase history.</p>
        <p className="mt-3 text-sm text-muted-foreground">Purchase details will appear here once you buy assets.</p>
      </div>
    </div>
  );
}
