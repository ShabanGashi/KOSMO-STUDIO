import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/roomunity")({
  head: () => ({ meta: [{ title: "Roomunity — KOSMO Creator Community" }] }),
  component: RoomunityPage,
});

function RoomunityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-5xl px-6">
          <div className="glass-panel rounded-3xl p-10 mb-12">
            <p className="text-sm text-primary uppercase tracking-[0.3em]">Community</p>
            <h1 className="mt-4 text-5xl font-bold">Roomunity</h1>
            <p className="mt-4 text-muted-foreground">
              Join the KOSMO community where creators connect, share, and grow together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="glass-panel rounded-2xl p-8 border border-white/10">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Connect with Creators</h3>
              <p className="text-muted-foreground">
                Network with fellow designers, developers, and digital creators from Kosovo and beyond.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-8 border border-white/10">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="text-xl font-semibold mb-2">Share & Learn</h3>
              <p className="text-muted-foreground">
                Exchange tips, best practices, and creative ideas. Learn what's working for top sellers.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-8 border border-white/10">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="text-xl font-semibold mb-2">Grow Together</h3>
              <p className="text-muted-foreground">
                Collaborate, support each other, and grow your audiences and sales together.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-8 border border-white/10">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Get Feedback</h3>
              <p className="text-muted-foreground">
                Get constructive feedback on your work and discover new opportunities for improvement.
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-8 border border-white/10 mb-12">
            <h2 className="text-2xl font-semibold mb-6">What Happens in Roomunity</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-primary mb-2">📣 Weekly Discussions</h3>
                <p className="text-muted-foreground">
                  Join conversations about design trends, pricing strategies, and creator success stories.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">🏆 Creator Spotlights</h3>
                <p className="text-muted-foreground">
                  Get featured and share your journey with the KOSMO community.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">🎓 Learning Resources</h3>
                <p className="text-muted-foreground">
                  Access guides, tutorials, and insights shared by experienced creators.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">🤗 Peer Support</h3>
                <p className="text-muted-foreground">
                  Get help from fellow creators who understand the challenges and opportunities.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-8 border border-primary/30 bg-primary/5 text-center">
            <h3 className="text-2xl font-semibold mb-3">Ready to Join Roomunity?</h3>
            <p className="text-muted-foreground mb-6">
              Connect with thousands of creators on KOSMO. It's free and open to all.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Create Account
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 px-6 py-3 text-sm text-foreground transition hover:bg-white/5"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
