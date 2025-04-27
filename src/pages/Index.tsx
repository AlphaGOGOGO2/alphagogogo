
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { GPTSUsage } from "@/components/landing/GPTSUsage";
import { FeaturedPosts } from "@/components/landing/FeaturedPost";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Index() {
  const { signInWithGoogle, session, signOut } = useAuth();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <GPTSUsage />
        <FeaturedPosts />
      </main>
      <Footer />
    </>
  );
}
