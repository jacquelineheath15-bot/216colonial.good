import {
  Navbar,
  Hero,
  AboutProperty,
  Services,
  GuestServices,
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
        <GuestServices />
        <AboutPalmBeach />
      </main>
      <Footer />
    </>
  );
}
