import { motion } from "framer-motion";
import { Smartphone, TreePine, Sparkles, ShieldCheck, Zap, Gift } from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "মোবাইল আসক্তি দূর করুন",
    desc: "বাচ্চারা মোবাইলে ডুবে আছে? বাবল গান তাদের বাইরে খেলতে আগ্রহী করবে। মোবাইল ফোন ভুলে যাবে!",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: TreePine,
    title: "বাইরে খেলার অভ্যাস",
    desc: "হাজারো রঙিন বাবল তৈরি করে বাচ্চাদের বাইরে দৌড়াদৌড়ি করতে উৎসাহিত করবে। শারীরিক ও মানসিক বিকাশ হবে।",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Sparkles,
    title: "অটোমেটিক বাবল মেশিন",
    desc: "শুধু বাটন প্রেস করুন — মুহূর্তেই শত শত রঙিন বাবল! ম্যানুয়ালি ফুঁ দেওয়ার ঝামেলা নেই।",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: ShieldCheck,
    title: "সম্পূর্ণ নিরাপদ",
    desc: "নন-টক্সিক বাবল সলিউশন, BPA-ফ্রি প্লাস্টিক। ছোট শিশুদের জন্য ১০০% নিরাপদ।",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Zap,
    title: "ব্যাটারি চালিত",
    desc: "রিচার্জেবল ব্যাটারি দিয়ে চলে। একবার চার্জে অনেকক্ষণ চলবে। ফ্রি বাবল সলিউশন সাথে থাকছে!",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Gift,
    title: "পারফেক্ট গিফট",
    desc: "জন্মদিন, ঈদ, বা যেকোনো অনুষ্ঠানে শিশুদের জন্য সেরা উপহার। প্রিমিয়াম প্যাকেজিং-এ পাচ্ছেন।",
    color: "bg-bubble-pink/10 text-bubble-pink",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            কেন এই <span className="text-gradient-hero">বাবল গান?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            শুধু একটা খেলনা নয় — এটা আপনার সন্তানের সুস্থ শৈশবের চাবিকাঠি
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="bg-background rounded-2xl p-6 border border-border hover:shadow-playful transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">{f.desc}</p>
              <a href="#order" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                🛒 এখনই অর্ডার করুন →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
