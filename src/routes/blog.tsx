import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/blog")({
  head: () => ({ meta: [{ title: "Blog — KOSMO" }] }),
  component: BlogPage,
});

const blogPosts = [
  {
    id: 1,
    title: "Getting Started as a Digital Creator on KOSMO",
    excerpt: "Learn how to upload your first asset and start earning on KOSMO's premium marketplace.",
    date: "2026-06-01",
    category: "Getting Started",
  },
  {
    id: 2,
    title: "Design Trends in 2026: What's Selling on KOSMO",
    excerpt: "Explore the hottest design trends and what buyers are looking for in templates and UI kits.",
    date: "2026-05-28",
    category: "Trends",
  },
  {
    id: 3,
    title: "Tips for Creating High-Converting Digital Products",
    excerpt: "Best practices for pricing, packaging, and promoting your digital assets to maximize sales.",
    date: "2026-05-20",
    category: "Tips",
  },
  {
    id: 4,
    title: "Meet Our Featured Creators: Success Stories from KOSMO",
    excerpt: "Discover how independent creators are building successful businesses on KOSMO.",
    date: "2026-05-15",
    category: "Community",
  },
];

function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-32 pb-20">
        <section className="mx-auto max-w-5xl px-6">
          <div className="glass-panel rounded-3xl p-10 mb-12">
            <p className="text-sm text-primary uppercase tracking-[0.3em]">Blog</p>
            <h1 className="mt-4 text-5xl font-bold">KOSMO Creator Hub</h1>
            <p className="mt-4 text-muted-foreground">
              Tips, trends, and stories from the KOSMO community
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                to="#"
                className="group glass-panel rounded-2xl p-6 hover:border-primary/50 transition border border-white/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary transition mb-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">More articles coming soon...</p>
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Back to Marketplace
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
