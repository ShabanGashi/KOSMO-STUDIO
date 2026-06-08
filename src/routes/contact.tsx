import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact Us — KOSMO" }] }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-5xl px-6">
          <div className="glass-panel rounded-3xl p-10">
            <div className="max-w-2xl">
              <p className="text-sm text-primary uppercase tracking-[0.3em]">Get in Touch</p>
              <h1 className="mt-4 text-5xl font-bold">Contact KOSMO</h1>
              <p className="mt-4 text-muted-foreground">
                Have a question or feedback? We'd love to hear from you.
              </p>
            </div>

            <div className="mt-12 grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input placeholder="Your name" className="bg-white/5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="your@email.com" className="bg-white/5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input placeholder="How can we help?" className="bg-white/5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea placeholder="Your message..." className="bg-white/5" rows={4} />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Send Message
                  </Button>
                </form>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-6">Other Ways to Reach Us</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-muted-foreground">support@kosmo.local</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">For Creators</h3>
                    <p className="text-muted-foreground">
                      Questions about uploading or selling? Visit our <Link to="/support" className="text-primary hover:underline">support page</Link> or join <Link to="/roomunity" className="text-primary hover:underline">Roomunity</Link>.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Response Time</h3>
                    <p className="text-muted-foreground">
                      We typically respond to inquiries within 24-48 hours.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-muted-foreground">
                      For business inquiries and partnerships, please include "Business Inquiry" in your subject line.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
