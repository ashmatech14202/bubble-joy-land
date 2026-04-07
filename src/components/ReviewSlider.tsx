import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCallback } from "react";

const reviews = [
  { name: "ফারহানা আক্তার", loc: "ঢাকা", text: "আমার ছেলে সারাদিন মোবাইলে গেম খেলতো। এই বাবল গান দেওয়ার পর থেকে বাইরে ছুটে যায়!" },
  { name: "মোঃ রাশেদ", loc: "চট্টগ্রাম", text: "মেয়ের জন্মদিনে গিফট দিয়েছিলাম। ওর চোখে-মুখে যে আনন্দ দেখলাম, সেটা অমূল্য!" },
  { name: "সাবরিনা ইসলাম", loc: "সিলেট", text: "প্রডাক্ট কোয়ালিটি অসাধারণ। বাচ্চারা মোবাইল না ধরে এখন বাবল নিয়ে খেলে।" },
  { name: "তানভীর হাসান", loc: "রাজশাহী", text: "ক্যাশ অন ডেলিভারিতে পেয়ে ভালো লাগলো। প্রডাক্ট চেক করে নিলাম, একদম অরিজিনাল।" },
  { name: "নুসরাত জাহান", loc: "খুলনা", text: "ভাইয়ের বাচ্চাকে দিয়েছি, এখন ও সারাদিন বাবল নিয়ে খেলে। মোবাইল ভুলে গেছে!" },
  { name: "আবু সাঈদ", loc: "বরিশাল", text: "ডেলিভারি খুব দ্রুত পেয়েছি। প্রডাক্ট দেখে খুশি হয়েছি, বাচ্চারাও খুশি।" },
  { name: "রুমানা পারভীন", loc: "কুমিল্লা", text: "৩ বছরের মেয়ের জন্য কিনেছি। একদম সেফ, কোনো সমস্যা নেই। বাবল সলিউশনও ফ্রি পেলাম।" },
  { name: "মাহমুদুল হক", loc: "গাজীপুর", text: "অফিস থেকে ফিরে দেখি বাচ্চা বাগানে বাবল নিয়ে খেলছে! আগে শুধু ট্যাবে থাকতো।" },
  { name: "শামীমা বেগম", loc: "নারায়ণগঞ্জ", text: "পাড়ার সব বাচ্চারা এখন একসাথে বাবল নিয়ে খেলে। দারুণ জিনিস!" },
  { name: "রফিকুল ইসলাম", loc: "রংপুর", text: "ছেলের মোবাইল আসক্তি নিয়ে চিন্তিত ছিলাম। এই বাবল গান সত্যিই কাজ করেছে।" },
  { name: "তাসনিম ফাতেমা", loc: "ময়মনসিংহ", text: "ঈদে বাচ্চাদের জন্য ২টা কিনলাম। দুই ভাই-বোন মিলে বাবল নিয়ে মাঠে দৌড়ায়!" },
  { name: "জাহিদ হাসান", loc: "ঢাকা", text: "প্যাকেজিং সুন্দর ছিল। গিফট হিসেবে দিলাম, সবাই প্রশংসা করলো।" },
  { name: "নাজমুন নাহার", loc: "যশোর", text: "বাটন প্রেস করলেই শত শত বাবল! বাচ্চা তো পাগল হয়ে গেছে খুশিতে!" },
  { name: "ইমরান হোসেন", loc: "টাঙ্গাইল", text: "দাম কম, কোয়ালিটি ভালো। আমার বাচ্চার সবচেয়ে প্রিয় খেলনা এখন এটাই।" },
  { name: "ফাতেমা খাতুন", loc: "পাবনা", text: "মোবাইল ছাড়া বাচ্চা কিছু করতো না। এখন বিকেলে বাবল গান নিয়ে বেরিয়ে পড়ে!" },
  { name: "সোহেল রানা", loc: "দিনাজপুর", text: "অনলাইনে কেনায় ভয় ছিল, কিন্তু প্রডাক্ট হাতে পেয়ে সব ভয় দূর হয়ে গেছে।" },
  { name: "আফরিন সুলতানা", loc: "বগুড়া", text: "স্কুল থেকে ফিরেই বাবল গান নিয়ে ছুটে যায় ছাদে। মোবাইলের কথা মনেই নেই!" },
  { name: "কামরুল হাসান", loc: "ফরিদপুর", text: "ব্যাটারি অনেকক্ষণ চলে। একবার চার্জে প্রায় ঘণ্টাখানেক চলে।" },
  { name: "লাবণ্য দাস", loc: "সিলেট", text: "বান্ধবীর বাচ্চার জন্য কিনেছিলাম। এতো ভালো লাগলো যে নিজের বাচ্চার জন্যও অর্ডার দিলাম!" },
  { name: "মনির হোসেন", loc: "নোয়াখালী", text: "ডেলিভারি ম্যান প্রডাক্ট চেক করে দিলেন। একদম যেমন ছবিতে দেখেছি, তেমনই।" },
  { name: "সুমাইয়া আক্তার", loc: "চাঁদপুর", text: "৫ বছরের মেয়ে আর ৩ বছরের ছেলে দুজনেই খেলতে পারে। খুবই সহজ!" },
  { name: "আরিফুল ইসলাম", loc: "মানিকগঞ্জ", text: "পার্টিতে নিয়ে গেলাম, সব বাচ্চারা লাইন দিয়ে খেলতে চাইলো। হিট আইটেম!" },
  { name: "মৌসুমী রহমান", loc: "কিশোরগঞ্জ", text: "আমার মা-ও খেলছেন নাতি-নাতনিদের সাথে! সব বয়সের জন্য মজার।" },
  { name: "শফিকুল ইসলাম", loc: "ব্রাহ্মণবাড়িয়া", text: "ফ্রি বাবল সলিউশন ২ বোতল পেলাম। অনেকদিন চলবে এটা দিয়ে।" },
  { name: "রেহানা বেগম", loc: "হবিগঞ্জ", text: "বাচ্চাদের আউটডোর খেলার অভ্যাস তৈরি হচ্ছে। ধন্যবাদ এই প্রডাক্টকে!" },
  { name: "নাঈম উদ্দিন", loc: "লক্ষ্মীপুর", text: "একটু দাম বেশি মনে হচ্ছিল, কিন্তু কোয়ালিটি দেখে বুঝলাম দাম যথার্থ।" },
  { name: "সালমা খাতুন", loc: "সাতক্ষীরা", text: "পাড়ার ৪-৫টা বাচ্চা একসাথে বাবল ধরতে দৌড়ায়। দারুণ এক্সারসাইজ হচ্ছে!" },
  { name: "হাবিবুর রহমান", loc: "ঠাকুরগাঁও", text: "ছেলের চোখের সমস্যা হচ্ছিলো মোবাইলে। এখন বাইরে খেলে, চোখও ভালো থাকছে।" },
  { name: "নাজনীন সুলতানা", loc: "জামালপুর", text: "এটা শুধু খেলনা না, বাচ্চাদের সুস্থ রাখার একটা উপায়। সব মায়েদের কেনা উচিত।" },
  { name: "আনিসুর রহমান", loc: "শেরপুর", text: "ছোট ভাইয়ের বাচ্চাকে গিফট করলাম। ভাবি বললো সেরা গিফট!" },
  { name: "ফারজানা ইয়াসমিন", loc: "মুন্সীগঞ্জ", text: "রাতে ঘুমানোর আগে বলে — কাল আবার বাবল খেলবো! মোবাইলের কথাই বলে না।" },
  { name: "মিজানুর রহমান", loc: "নেত্রকোনা", text: "অটোমেটিক হওয়ায় ছোট বাচ্চারাও সহজে চালাতে পারে। দারুণ ডিজাইন।" },
  { name: "শাহনাজ পারভীন", loc: "গোপালগঞ্জ", text: "২ দিনের মধ্যে ডেলিভারি পেলাম। দ্রুত সার্ভিস, ভালো প্রডাক্ট।" },
  { name: "আশরাফুল আলম", loc: "মাদারীপুর", text: "বিয়ের অনুষ্ঠানে ব্যবহার করলাম, অসাধারণ পরিবেশ তৈরি হলো! সবাই জিজ্ঞেস করলো কোথায় পেলাম।" },
  { name: "তাহমিনা আক্তার", loc: "শরীয়তপুর", text: "আমার ৪ বছরের ছেলে নিজেই ধরতে পারে, হালকা ওজনের। খুবই সন্তুষ্ট!" },
  { name: "জসিম উদ্দিন", loc: "কুষ্টিয়া", text: "প্রথমে বিশ্বাস হচ্ছিলো না এত ভালো হবে। হাতে পেয়ে বুঝলাম, সত্যিই দারুণ!" },
  { name: "রাবেয়া বেগম", loc: "মেহেরপুর", text: "নাতি-নাতনি ৩ জনের জন্য ৩টা কিনলাম। সবাই নিজের নিজের বাবল গান নিয়ে ব্যস্ত!" },
  { name: "আল-আমিন", loc: "চুয়াডাঙ্গা", text: "YouTube দেখা একদম কমে গেছে। এখন বিকেলে বাবল খেলাই ওর প্রধান বিনোদন।" },
  { name: "নূরজাহান বেগম", loc: "ঝিনাইদহ", text: "বাচ্চা কান্না করলে বাবল গান চালু করি, সাথে সাথে হাসতে শুরু করে!" },
  { name: "মাসুদ রানা", loc: "মাগুরা", text: "পণ্যের সাথে ফ্রি সলিউশন দেওয়ায় আলাদা কিনতে হয়নি। বুদ্ধিমান ব্যবসা!" },
  { name: "পারভীন আক্তার", loc: "নড়াইল", text: "বাচ্চার স্ক্রিন টাইম কমানোর সেরা উপায়। ডাক্তারও বললেন আউটডোর খেলা বাড়ান।" },
  { name: "শাকিল আহমেদ", loc: "সুনামগঞ্জ", text: "বৃষ্টির দিন ছাড়া প্রতিদিন বিকেলে বাবল সেশন চলে আমাদের বাসায়!" },
  { name: "আয়েশা সিদ্দিকা", loc: "মৌলভীবাজার", text: "LED লাইট জ্বলে রাতেও খেলা যায়। বাচ্চারা রাতের বাবল বেশি পছন্দ করে!" },
  { name: "বেলাল হোসেন", loc: "ফেনী", text: "দোকানে ১২০০ টাকা চাইলো, এখানে ৯৯০ তে পেলাম। সেভ হলো!" },
  { name: "মাহফুজা খানম", loc: "লালমনিরহাট", text: "গ্রামের বাচ্চারা আগে কখনো এরকম দেখেনি। সবার চোখ বড় বড় হয়ে গেলো!" },
  { name: "রাজিব হাসান", loc: "কুড়িগ্রাম", text: "ভাগ্নির জন্মদিনে সারপ্রাইজ গিফট দিলাম। সারাদিন বাবল নিয়ে মেতে ছিল!" },
  { name: "শিরিন আক্তার", loc: "গাইবান্ধা", text: "মা হিসেবে বলছি — এই প্রডাক্ট বাচ্চাদের মোবাইল থেকে দূরে রাখতে সত্যিই কাজ করে।" },
  { name: "আতিকুর রহমান", loc: "নীলফামারী", text: "৩ বার অর্ডার করেছি — নিজের বাচ্চা, ভাতিজা, আর বন্ধুর বাচ্চার জন্য। সবাই খুশি!" },
  { name: "হাসিনা বেগম", loc: "পঞ্চগড়", text: "শীতের সময়ও বাইরে গিয়ে বাবল খেলতে চায়। ভালো ব্যায়াম হচ্ছে বাচ্চার!" },
  { name: "কাজী নাসির", loc: "জয়পুরহাট", text: "WhatsApp এ অর্ডার করলাম, পরদিনই পেয়ে গেলাম ঢাকায়। এক্সিলেন্ট সার্ভিস!" },
];

const ReviewSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="py-16 md:py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            ক্রেতাদের মতামত 💬
          </h2>
          <p className="text-muted-foreground">৫০+ সন্তুষ্ট মা-বাবা যারা ইতিমধ্যে কিনেছেন</p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation buttons */}
          <button
            onClick={scrollPrev}
            className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Slider */}
          <div className="overflow-hidden px-2" ref={emblaRef}>
            <div className="flex gap-4">
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="flex-none w-[85%] sm:w-[45%] lg:w-[30%]"
                >
                  <div className="bg-card rounded-2xl p-5 border border-border h-full flex flex-col">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-bubble-yellow text-bubble-yellow" />
                      ))}
                    </div>
                    <p className="text-foreground text-sm leading-relaxed mb-4 flex-1">"{r.text}"</p>
                    <div className="text-xs border-t border-border pt-3">
                      <span className="font-semibold text-foreground">{r.name}</span>
                      <span className="text-muted-foreground"> — {r.loc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA after slider */}
          <div className="text-center mt-10">
            <a
              href="#order"
              className="inline-block bg-cta-gradient text-secondary-foreground px-8 py-4 rounded-full text-lg font-bold shadow-warm hover:scale-105 transition-transform"
            >
              🛒 এখনই অর্ডার করুন — ৳৯৯০
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSlider;
