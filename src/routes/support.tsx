import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support — KOSMO" }] }),
  component: SupportPage,
});

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I create an account on KOSMO?",
        a: "Click the 'Create Account' button, fill in your details, and verify your email. You can start browsing immediately and upload assets once you complete your profile.",
      },
      {
        q: "Is there a fee to sign up?",
        a: "No, KOSMO is completely free to join. You only pay when you make a purchase or earn from selling assets.",
      },
      {
        q: "Can I sell and buy on KOSMO?",
        a: "Yes! Once you have an account, you can both purchase digital assets and upload your own for sale.",
      },
    ],
  },
  {
    category: "Selling on KOSMO",
    questions: [
      {
        q: "What types of assets can I sell?",
        a: "You can sell templates, UI kits, graphics, photos, design resources, and any other digital products. Ensure you have the rights to sell the content.",
      },
      {
        q: "How do I set the price for my assets?",
        a: "You have full control over pricing. Set any price you want, or offer your assets for free to build an audience.",
      },
      {
        q: "What commission does KOSMO take?",
        a: "KOSMO takes a competitive commission on sales while ensuring creators earn fairly. Check your dashboard for detailed earnings breakdown.",
      },
    ],
  },
  {
    category: "Purchasing",
    questions: [
      {
        q: "How do I download a purchased asset?",
        a: "After purchase, you'll receive an instant download link. You can also access your downloads from your account dashboard.",
      },
      {
        q: "Can I refund a purchase?",
        a: "Digital assets are typically non-refundable as they can be instantly downloaded. Contact support if you have issues with a purchased item.",
      },
      {
        q: "What file formats are included?",
        a: "File formats vary by asset. Check the product description before purchasing to see what formats are included.",
      },
    ],
  },
];

function SupportPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-5xl px-6">
          <div className="glass-panel rounded-3xl p-10 mb-12">
            <p className="text-sm text-primary uppercase tracking-[0.3em]">Help & Support</p>
            <h1 className="mt-4 text-5xl font-bold">Support Center</h1>
            <p className="mt-4 text-muted-foreground">
              Find answers to common questions or reach out to our support team.
            </p>
          </div>

          <div className="space-y-8 mb-12">
            {faqs.map((section) => (
              <div key={section.category} className="glass-panel rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-semibold mb-6">{section.category}</h2>
                <div className="space-y-4">
                  {section.questions.map((item, idx) => (
                    <details key={idx} className="group cursor-pointer">
                      <summary className="flex items-start justify-between font-semibold py-2 hover:text-primary transition">
                        <span className="flex-1 text-left">{item.q}</span>
                        <span className="ml-4 text-primary/50 group-open:rotate-180 transition">▼</span>
                      </summary>
                      <p className="text-muted-foreground mt-3 pl-0 pb-2">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel rounded-2xl p-8 border border-white/10 text-center">
            <h3 className="text-2xl font-semibold mb-3">Didn't find what you need?</h3>
            <p className="text-muted-foreground mb-6">
              Contact our support team or join the Roomunity community for peer-to-peer help.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Contact Support
              </Link>
              <Link
                to="/roomunity"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 px-6 py-3 text-sm text-foreground transition hover:bg-white/5"
              >
                Join Roomunity
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
