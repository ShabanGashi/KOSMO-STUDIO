import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — KOSMO" }] }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-5xl px-6">
          <div className="glass-panel rounded-3xl p-10">
            <div className="max-w-2xl">
              <p className="text-sm text-primary uppercase tracking-[0.3em]">Pricing</p>
              <h1 className="mt-4 text-5xl font-bold">Flexible pricing for every creator.</h1>
              <p className="mt-4 text-muted-foreground">
                Every asset on KOSMO can be offered as free or paid. Creators control price, sale price, and category metadata when they upload.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <PriceCard title="Free assets" subtitle="Grow your audience" price="$0" description="Publish free downloads to build traction and followers." />
              <PriceCard title="Premium assets" subtitle="One-time payment" price="$15+" description="Set your own price for quality templates, UI kits and design resources." />
              <PriceCard title="Creator tools" subtitle="Full control" price="Included" description="Manage uploads, favorites and analytics right from your dashboard." />
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Ready to publish?</h2>
                <p className="mt-2 text-muted-foreground">Create an account and upload your first asset in minutes.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  Create account
                </Link>
                <Link
                  to="/marketplace"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm text-foreground transition hover:bg-white/5"
                >
                  Browse marketplace
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function PriceCard({ title, subtitle, price, description }: { title: string; subtitle: string; price: string; description: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/5">
      <div className="text-sm text-muted-foreground uppercase tracking-[0.24em] mb-3">{title}</div>
      <div className="text-3xl font-semibold">{price}</div>
      <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>
      <p className="mt-5 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
