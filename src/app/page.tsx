import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Occasions } from "@/components/Occasions";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { PageWrapper } from "@/components/PageWrapper";

export default function Home() {
  return (
    <PageWrapper>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Occasions />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </PageWrapper>
  );
}
