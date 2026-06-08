import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service — KOSMO" }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-4xl px-6">
          <div className="glass-panel rounded-3xl p-10">
            <p className="text-sm text-primary uppercase tracking-[0.3em]">Legal</p>
            <h1 className="mt-4 text-5xl font-bold">Terms of Service</h1>
            <p className="mt-4 text-muted-foreground">Last updated: June 2026</p>

            <div className="mt-12 space-y-8 text-muted-foreground">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Acceptance of Terms</h2>
                <p>
                  By accessing and using KOSMO, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Use License</h2>
                <div className="space-y-3">
                  <p>
                    Permission is granted to temporarily download one copy of the materials (information or software) on KOSMO for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• Modify or copy the materials</li>
                    <li>• Use the materials for any commercial purpose or for any public display</li>
                    <li>• Attempt to decompile or reverse engineer any software contained on KOSMO</li>
                    <li>• Remove any copyright or other proprietary notations from the materials</li>
                    <li>• Transfer the materials to another person or "mirror" the materials on any other server</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">User Content</h2>
                <p>
                  Users retain all ownership rights to content they upload. By uploading content to KOSMO, you grant us a license to use, display, and distribute your content on the platform. You warrant that you own or have the necessary rights to the content you upload.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Digital Products</h2>
                <div className="space-y-3">
                  <p>
                    All purchases are final and non-refundable. Digital assets are delivered immediately upon purchase. You agree to use purchased digital assets only for lawful purposes and in accordance with the license terms provided by the creator.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Prohibited Conduct</h2>
                <p>
                  You agree not to:
                </p>
                <ul className="space-y-2 ml-4 mt-3">
                  <li>• Upload or distribute content that infringes intellectual property rights</li>
                  <li>• Engage in harassment, abuse, or hate speech</li>
                  <li>• Attempt to gain unauthorized access to the platform</li>
                  <li>• Use the platform for any illegal or fraudulent purpose</li>
                  <li>• Spam or engage in any form of automated data collection</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
                <p>
                  In no event shall KOSMO be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the materials on KOSMO.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Governing Law</h2>
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws of Kosovo, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Contact</h2>
                <p>
                  If you have questions about these Terms of Service, please contact us at support@kosmo.local.
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
