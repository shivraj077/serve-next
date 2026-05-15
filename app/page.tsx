import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Pricing from '@/components/Pricing';
import Features from '@/components/Features';
import Network from '@/components/Network';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Pricing />
      <Features />
      <Network />
      <Testimonials />
      <Footer />
    </main>
  );
}
