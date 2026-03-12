import React, { useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Star, ShieldCheck, Users, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import heroVideo from '../assets/video/video12.mp4';

// Premium cream & charcoal palette – Old Money aesthetic
const BG_CREAM = '#FAFAFA';
const TEXT_CHARCOAL = '#333333';
const TEXT_MUTED = '#6B7280';

// Masonry placeholder images – premium store / beauty
const ROOTS_IMAGES = [
  'https://images.unsplash.com/photo-1691187861263-089f49891144?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1681490813995-ab422f7d6e3b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1654796372840-5684e1bea0f6?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
]

const CURATION_CARDS = [
  {
    icon: Star,
    title: 'Expertly Curated',
    text: "We don't just sell everything; we sell what works. From mass favorites to premium salon-grade exclusives like O3+ and Schwarzkopf.",
  },
  {
    icon: ShieldCheck,
    title: '100% Authentic',
    text: 'Direct partnerships with brands to ensure you only get genuine, high-quality products.',
  },
  {
    icon: Users,
    title: 'For Everyone',
    text: 'Bridging the gap between daily skincare routines and professional salon setups.',
  },
];

const Story = () => {
  const heroRef = useRef(null);
  const rootsRef = useRef(null);
  const curationRef = useRef(null);
  const visionRef = useRef(null);

  const rootsInView = useInView(rootsRef, { once: true, margin: '-80px' });
  const curationInView = useInView(curationRef, { once: true, margin: '-80px' });
  const visionInView = useInView(visionRef, { once: true, margin: '-80px' });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

  const scrollToContent = () => {
    rootsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* 1. Hero – full screen, video + overlay, centered text + bouncing arrow */}
        <motion.section
          ref={heroRef}
          className="relative h-screen w-full flex items-center justify-center overflow-hidden"
          style={{ paddingTop: 0 }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={heroVideo}
          />
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            className="relative z-10 px-6 text-center max-w-4xl mx-auto"
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-white tracking-[0.25em] md:tracking-[0.35em] leading-tight"
            >
              Redefining Beauty, One Shade at a Time.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-6 text-base md:text-lg text-white/85 font-sans max-w-2xl mx-auto leading-relaxed"
            >
              From a trusted destination for beauty professionals and enthusiasts to your digital screens.
            </motion.p>
          </motion.div>
          <motion.button
            type="button"
            onClick={scrollToContent}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/90 hover:text-white transition-colors focus:outline-none"
            aria-label="Scroll to content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <ChevronDown size={32} strokeWidth={2} />
            </motion.div>
          </motion.button>
        </motion.section>

        {/* 2. The Roots – side-by-side grid, text left, masonry right */}
        <section
          ref={rootsRef}
          className="py-24 px-6 md:px-20"
          style={{ backgroundColor: BG_CREAM }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={rootsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="order-2 md:order-1"
            >
              <p className="text-sm font-sans uppercase tracking-widest mb-1" style={{ color: TEXT_MUTED }}>
                The Roots
              </p>
              <p className="text-sm font-sans mb-6" style={{ color: TEXT_MUTED }}>
                The Offline Legacy
              </p>
              <h2 className="text-3xl md:text-4xl font-serif mb-6 leading-tight" style={{ color: TEXT_CHARCOAL }}>
                Our Roots in Indore
              </h2>
              <p className="text-base md:text-lg font-sans leading-relaxed" style={{ color: TEXT_CHARCOAL }}>
                We didn't just start an online store; we brought years of offline retail trust and professional salon
                expertise to the internet. We know what works because we interact with thousands of customers and
                salon experts every single day.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={rootsInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="order-1 md:order-2 grid grid-cols-2 gap-3"
            >
              <div className="col-span-2 md:col-span-1 row-span-2 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={ROOTS_IMAGES[0]}
                  alt="The Beauty Hub legacy"
                  className="w-full h-full object-cover min-h-[280px]"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md">
                <img
                  src={ROOTS_IMAGES[1]}
                  alt="Beauty retail"
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md">
                <img
                  src={ROOTS_IMAGES[2]}
                  alt="Salon expertise"
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. The Curation – 3 cards, stagger animation */}
        <section
          ref={curationRef}
          className="py-24 px-6 md:px-20"
          style={{ backgroundColor: BG_CREAM }}
        >
          <div className="max-w-7xl mx-auto">
            <p className="text-sm font-sans uppercase tracking-widest mb-1" style={{ color: TEXT_MUTED }}>
              The Curation
            </p>
            <p className="text-sm font-sans mb-12" style={{ color: TEXT_MUTED }}>
              Why Choose Us?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CURATION_CARDS.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={curationInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="mb-5" style={{ color: TEXT_CHARCOAL }}>
                      <Icon size={28} strokeWidth={1.5} className="text-[#333333]" />
                    </div>
                    <h3 className="text-xl font-serif mb-3" style={{ color: TEXT_CHARCOAL }}>
                      {card.title}
                    </h3>
                    <p className="text-sm md:text-base font-sans leading-relaxed" style={{ color: TEXT_MUTED }}>
                      {card.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. The Vision – dark section, quote */}
        <section
          ref={visionRef}
          className="py-24 px-6 md:px-20 bg-[#1a1a1a] text-white"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={visionInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="text-xs font-sans uppercase tracking-widest mb-1 text-white/60"
            >
              The Vision
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={visionInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm font-sans mb-10 text-white/70"
            >
              Look to the Future
            </motion.p>
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={visionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed relative"
            >
              <Sparkles className="absolute -left-2 -top-2 w-6 h-6 text-white/40 hidden md:block" />
              Our mission is simple: To make premium, authentic beauty and professional grooming accessible to every
              individual and business.
            </motion.blockquote>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Story;
