import {
  Navbar,
  Hero,
  AboutProperty,
  Services,
  AboutPalmBeach,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AboutProperty />
        <Services />
        <AboutPalmBeach />
      </main>
      <Footer />
    </>
  );
}
