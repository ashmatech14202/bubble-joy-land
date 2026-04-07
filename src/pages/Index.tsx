import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ReviewSlider from "@/components/ReviewSlider";
import ProductGallery from "@/components/ProductGallery";
import CheckoutSection from "@/components/CheckoutSection";
import ProductListSection from "@/components/ProductListSection";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart } from "lucide-react";

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

      {/* Sticky Order Button */}
      <a
        href="#order"
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-secondary text-secondary-foreground font-bold text-base shadow-[0_8px_30px_-4px_hsl(var(--secondary)/0.5)] hover:shadow-[0_12px_40px_-4px_hsl(var(--secondary)/0.6)] hover:scale-105 transition-all duration-300"
      >
        <ShoppingCart className="w-5 h-5" />
        এখনই অর্ডার করুন — ৳৯৯০
      </a>
    </main>
  );
};

export default Index;
