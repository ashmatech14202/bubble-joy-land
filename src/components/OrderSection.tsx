import { motion } from "framer-motion";
import { Check, Phone } from "lucide-react";

const OrderSection = () => {
  const benefits = [
    "ফ্রি বাবল সলিউশন (৪ বোতল)",
    "ক্যাশ অন ডেলিভারি",
    "প্রডাক্ট চেক করে নেওয়ার সুযোগ",
    "সারাদেশে ডেলিভারি",
    "১০০% অরিজিনাল প্রডাক্ট",
  ];

  return (
    <section id="order" className="py-20 bg-hero-gradient relative overflow-hidden">
      {/* Decorative bubbles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 15 + Math.random() * 50,
            height: 15 + Math.random() * 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle at 30% 30%, hsla(0, 0%, 100%, 0.15), transparent)`,
            border: '1px solid hsla(0, 0%, 100%, 0.1)',
          }}
          animate={{ y: [-10, -40, -10], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: i * 0.7 }}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              আজই অর্ডার করুন! 🎈
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              সীমিত সময়ের জন্য বিশেষ ছাড়ে পাচ্ছেন
            </p>

            {/* Price card */}
            <div className="bg-card rounded-3xl p-8 shadow-2xl mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="text-muted-foreground line-through text-2xl">৳১,৩৫০</span>
                <span className="text-5xl font-bold text-foreground">৳৯৯০</span>
                <span className="bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1 rounded-full">
                  ২৭% ছাড়
                </span>
              </div>

              <ul className="text-left space-y-3 mb-8">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <a
                href="https://wa.me/+8801898883577?text=আমি%20বাবল%20গান%20অর্ডার%20করতে%20চাই"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-cta-gradient text-secondary-foreground py-4 rounded-2xl text-xl font-bold shadow-warm hover:scale-[1.02] transition-transform text-center"
              >
                🛒 এখনই অর্ডার করুন
              </a>

              <a
                href="tel:+8801898883577"
                className="flex items-center justify-center gap-2 mt-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                অথবা কল করুন: ০১৮৯৮-৮৮৩৫৭৭
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;
