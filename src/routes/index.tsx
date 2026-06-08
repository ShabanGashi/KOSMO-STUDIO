import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Categories } from "@/components/landing/Categories";
import { Trending } from "@/components/landing/Trending";
import { Creators } from "@/components/landing/Creators";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTA } from "@/components/landing/CTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KOSMO — Premium Digital Assets Marketplace" },
      {
        name: "description",
        content:
          "KOSMO is Kosovo's first premium digital assets marketplace. Discover and sell templates, UI kits, photos, graphics and creative resources.",
      },
      { property: "og:title", content: "KOSMO — Premium Digital Assets Marketplace" },
      {
        property: "og:description",
        content:
          "Discover and sell templates, UI kits, photos and graphics on KOSMO — premium creator ecosystem.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Categories />
        <Trending />
        <Creators />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
