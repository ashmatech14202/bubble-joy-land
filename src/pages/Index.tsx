import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import OrderSection from "@/components/OrderSection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <OrderSection />

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
