import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ReviewSlider from "@/components/ReviewSlider";
import ProductGallery from "@/components/ProductGallery";
import CheckoutSection from "@/components/CheckoutSection";
import ProductListSection from "@/components/ProductListSection";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  useFacebookPixel();
  const [copyrightText, setCopyrightText] = useState("© ২০২৫ Libsun — সকল স্বত্ব সংরক্ষিত");

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "copyright_text")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setCopyrightText(data.value);
      });
  }, []);

  return (
    <main className="min-h-screen">
      <HeroSection />

      {/* Video Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">🎬 ভিডিওতে দেখুন</h2>
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src="https://www.youtube.com/embed/SohqxZ22mGA?autoplay=1&mute=0&loop=1&playlist=SohqxZ22mGA"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title="Product Video"
            />
          </div>
          <a href="#order" className="mt-8 inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground text-lg font-bold hover:opacity-90 transition-opacity shadow-lg">
            🛒 এখনই অর্ডার করুন
          </a>
        </div>
      </section>

      <FeaturesSection />
      <ProductListSection />
      <ReviewSlider />

      {/* Product + Checkout Section */}
      <section id="order" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            <ProductGallery />
            <CheckoutSection />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-8 text-center">
        <p className="text-primary-foreground/60 text-sm">
          {copyrightText}
        </p>
      </footer>


    </main>
  );
};

export default Index;
