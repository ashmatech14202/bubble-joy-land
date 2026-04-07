import { motion } from "framer-motion";

const testimonials = [
  {
    name: "ফারহানা আক্তার",
    text: "আমার ছেলে সারাদিন মোবাইলে গেম খেলতো। এই বাবল গান দেওয়ার পর থেকে বাইরে ছুটে যায়! অনেক ভালো প্রডাক্ট।",
    location: "ঢাকা",
  },
  {
    name: "মোঃ রাশেদ",
    text: "মেয়ের জন্মদিনে গিফট দিয়েছিলাম। ওর চোখে-মুখে যে আনন্দ দেখলাম, সেটা অমূল্য! ফ্রি বাবল সলিউশনও পেয়েছি।",
    location: "চট্টগ্রাম",
  },
  {
    name: "সাবরিনা ইসলাম",
    text: "প্রডাক্ট কোয়ালিটি অসাধারণ। বাচ্চারা মোবাইল না ধরে এখন বাবল নিয়ে খেলে। সব মায়েদের কেনা উচিত!",
    location: "সিলেট",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          মা-বাবারা কী বলছেন? 💬
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="bg-card rounded-2xl p-6 border border-border"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-bubble-yellow text-lg">⭐</span>
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-4">"{t.text}"</p>
              <div className="text-sm">
                <span className="font-semibold text-foreground">{t.name}</span>
                <span className="text-muted-foreground"> — {t.location}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
