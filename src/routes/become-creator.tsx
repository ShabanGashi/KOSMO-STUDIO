import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/become-creator")({
  head: () => ({ meta: [{ title: "Become a Creator — KOSMO" }] }),
  component: BecomeCreatorPage,
});

function BecomeCreatorPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-4xl px-6">
          <div className="glass-panel rounded-3xl p-10">
            <div className="max-w-2xl">
              <p className="text-sm text-primary uppercase tracking-[0.3em]">Creator onboarding</p>
              <h1 className="mt-4 text-5xl font-bold">Sell premium digital assets on KOSMO.</h1>
              <p className="mt-4 text-muted-foreground">
                Join Kosovo’s premium marketplace and publish templates, UI kits, design assets, photos, and more. Creators can manage uploads, pricing, favorites, and analytics from their dashboard.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <FeatureCard title="Upload assets" description="Publish cover images, gallery previews, and downloadable files." />
              <FeatureCard title="Set pricing" description="Offer free downloads or paid products with sale pricing." />
              <FeatureCard title="Track performance" description="See views, downloads, likes, and revenue for your products." />
              <FeatureCard title="Built for creators" description="Start selling with a secure Supabase-backed marketplace." />
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Get started with your creator account</h2>
                <p className="mt-2 text-muted-foreground">If you already have an account, sign in and head to the upload studio.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {loading ? (
                  <span className="inline-flex items-center rounded-xl bg-white/5 px-5 py-3 text-sm text-muted-foreground">Loading…</span>
                ) : user ? (
                  <Link
                    to="/dashboard/upload"
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                  >
                    Go to upload studio
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                  >
                    Create account
                  </Link>
                )}
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

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="text-sm font-semibold">{title}</div>
      <p className="mt-3 text-sm text-muted-foreground leading-6">{description}</p>
    </div>
  );
}
