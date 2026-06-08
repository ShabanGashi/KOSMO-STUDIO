import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — KOSMO" }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-4xl px-6">
          <div className="glass-panel rounded-3xl p-10">
            <p className="text-sm text-primary uppercase tracking-[0.3em]">Legal</p>
            <h1 className="mt-4 text-5xl font-bold">Privacy Policy</h1>
            <p className="mt-4 text-muted-foreground">Last updated: June 2026</p>

            <div className="mt-12 space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Introduction</h2>
                <p>
                  KOSMO ("we," "us," or "our") operates the premium digital assets marketplace. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Information We Collect</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground">Personal Information</h3>
                    <p>
                      We collect information you provide directly, such as name, email address, account credentials, payment information, and profile details.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Usage Information</h3>
                    <p>
                      We automatically collect information about your interactions with our service, including browsing history, search queries, and transaction history.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Device Information</h3>
                    <p>
                      We collect device type, operating system, browser type, and IP address for security and analytics purposes.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">How We Use Your Information</h2>
                <ul className="space-y-2">
                  <li>• To provide, maintain, and improve our services</li>
                  <li>• To process transactions and send related information</li>
                  <li>• To send promotional communications (with your consent)</li>
                  <li>• To respond to your inquiries and support requests</li>
                  <li>• To enforce our terms of service and other agreements</li>
                  <li>• To prevent fraud and enhance security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Data Protection</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is completely secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Your Rights</h2>
                <p>
                  You have the right to access, correct, or delete your personal information. You can manage your account settings or contact us to exercise these rights. You may also opt-out of marketing communications at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy or our privacy practices, please contact us at support@kosmo.local.
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
