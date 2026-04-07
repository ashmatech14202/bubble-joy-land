import { useState } from "react";
import { motion } from "framer-motion";
import bubbleGun1 from "@/assets/bubble-gun-1.jpg";
import bubbleGun2 from "@/assets/bubble-gun-2.jpg";

const images = [
  { src: bubbleGun1, alt: "বাবল গান — বাচ্চা খেলছে" },
  { src: bubbleGun2, alt: "বাবল গান — প্যাকেজিং" },
];

const ProductGallery = () => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-4">
      <motion.div
        className="rounded-2xl overflow-hidden border border-border bg-card aspect-square"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={selected}
      >
        <img
          src={images[selected].src}
          alt={images[selected].alt}
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className="flex gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
              selected === i ? "border-primary shadow-playful scale-105" : "border-border opacity-70 hover:opacity-100"
            }`}
          >
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
