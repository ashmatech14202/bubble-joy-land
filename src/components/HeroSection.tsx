import { motion } from "framer-motion";
import heroBg from "@/assets/hero-kids-bubbles.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="বাচ্চারা বাবল নিয়ে খেলছে" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-cta-gradient text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              🎉 ২৭% ছাড়ে পাচ্ছেন!
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            মোবাইলের আসক্তি দূর করুন,{" "}
            <span className="text-bubble-yellow">আনন্দে</span> ভরুক শৈশব!
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            অটোমেটিক বাবল গান — যেটা আপনার সন্তানকে মোবাইল ভুলিয়ে বাইরে খেলতে নিয়ে যাবে। হাজারো রঙিন বাবলের জাদুতে শিশুর মুখে ফুটবে হাসি!
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 items-start"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <a
              href="#order"
              className="bg-cta-gradient text-secondary-foreground px-8 py-4 rounded-full text-lg font-bold shadow-warm hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              🛒 এখনই অর্ডার করুন — ৳৯৯০
            </a>
            <div className="text-primary-foreground/60 flex items-center gap-2">
              <span className="line-through text-sm">৳১,৩৫০</span>
              <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded">-২৭%</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating bubbles decoration */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary-foreground/20"
          style={{
            width: 20 + Math.random() * 40,
            height: 20 + Math.random() * 40,
            right: `${10 + Math.random() * 30}%`,
            bottom: `${10 + Math.random() * 60}%`,
            background: `radial-gradient(circle at 30% 30%, hsla(195, 90%, 80%, 0.3), transparent)`,
          }}
          animate={{
            y: [-20, -60, -20],
            x: [0, 10, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </section>
  );
};

export default HeroSection;
