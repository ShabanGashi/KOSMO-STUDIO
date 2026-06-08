import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About KOSMO" }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-5xl px-6">
          <div className="glass-panel rounded-3xl p-10">
            <div className="max-w-3xl">
              <p className="text-sm text-primary uppercase tracking-[0.3em]">About</p>
              <h1 className="mt-4 text-5xl font-bold">About KOSMO</h1>
              <p className="mt-6 text-lg text-muted-foreground">
                KOSMO is Kosovo's first premium digital assets marketplace, designed to empower creators and connect them with a global audience.
              </p>
            </div>

            <div className="mt-12 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We believe every creator deserves a platform to showcase their work and earn from their creativity. KOSMO provides a seamless marketplace where digital assets like templates, UI kits, graphics, photos, and design resources can be discovered and purchased by creators worldwide.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Premium Marketplace</h2>
                <p className="text-muted-foreground leading-relaxed">
                  KOSMO is more than just a marketplace—it's a curated ecosystem of high-quality digital products. We focus on premium content created by talented designers and developers from Kosovo and beyond. Every asset on KOSMO is vetted to ensure quality and value for our community.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">What We Offer</h2>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="border border-white/10 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">For Creators</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Upload and sell your digital assets</li>
                      <li>• Set your own pricing</li>
                      <li>• Track sales and analytics</li>
                      <li>• Build your creator profile</li>
                    </ul>
                  </div>
                  <div className="border border-white/10 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">For Buyers</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Browse curated digital assets</li>
                      <li>• Download instantly after purchase</li>
                      <li>• Support independent creators</li>
                      <li>• Access high-quality templates and resources</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We envision KOSMO as the go-to marketplace for digital creators in Kosovo and the region. By providing tools, community, and opportunities, we're building an ecosystem where creativity thrives and creators are fairly rewarded for their work.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
