import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ProductGallery from "@/components/ProductGallery";
import CheckoutSection from "@/components/CheckoutSection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />

      {/* Product + Checkout Section */}
      <section id="order" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            <ProductGallery />
            <CheckoutSection />
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* Footer */}
      <footer className="bg-foreground py-8 text-center">
        <p className="text-primary-foreground/60 text-sm">
          © ২০২৫ Libsun — সকল স্বত্ব সংরক্ষিত
        </p>
      </footer>
    </main>
  );
};

export default Index;
