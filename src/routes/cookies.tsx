import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/cookies")({
  head: () => ({ meta: [{ title: "Cookie Policy — KOSMO" }] }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-4xl px-6">
          <div className="glass-panel rounded-3xl p-10">
            <p className="text-sm text-primary uppercase tracking-[0.3em]">Legal</p>
            <h1 className="mt-4 text-5xl font-bold">Cookie Policy</h1>
            <p className="mt-4 text-muted-foreground">Last updated: June 2026</p>

            <div className="mt-12 space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">What are Cookies?</h2>
                <p>
                  Cookies are small data files stored on your device when you visit KOSMO. They help us recognize you, remember your preferences, and improve your experience on our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">How We Use Cookies</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Essential Cookies</h3>
                    <p>
                      These cookies are necessary for the basic functioning of KOSMO, including authentication, session management, and security features.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Performance Cookies</h3>
                    <p>
                      We use these to understand how you use KOSMO, track performance metrics, and identify areas for improvement.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Preference Cookies</h3>
                    <p>
                      These remember your preferences and settings, such as language, layout, and account information.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Marketing Cookies</h3>
                    <p>
                      With your consent, we use these to deliver personalized content and track marketing campaign effectiveness.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Third-Party Cookies</h2>
                <p>
                  KOSMO may contain links to third-party services that use their own cookies. We are not responsible for their cookie practices. Please review their cookie policies directly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Managing Your Cookies</h2>
                <div className="space-y-3 mt-3">
                  <p>
                    Most browsers allow you to refuse cookies or alert you when cookies are being sent. However, blocking cookies may affect your ability to use KOSMO fully.
                  </p>
                  <p>
                    You can manage cookie preferences through:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• Your browser settings</li>
                    <li>• Cookie consent tools on our website</li>
                    <li>• Your KOSMO account preferences (if applicable)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Cookie Retention</h2>
                <p>
                  Session cookies are deleted when you close your browser. Persistent cookies remain on your device until they expire or you delete them. We typically retain cookies for 1-2 years.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Contact Us</h2>
                <p>
                  If you have questions about our cookie practices, please contact us at support@kosmo.local.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
