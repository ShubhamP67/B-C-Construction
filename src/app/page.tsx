"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import LoadingScreen from "@/components/LoadingScreen";
import AnimatedBackground from "@/components/AnimatedBackground";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: "Modern Office Complex", category: "Commercial", year: "2023" },
  { title: "Luxury Residential Tower", category: "Residential", year: "2023" },
  { title: "Healthcare Facility", category: "Healthcare", year: "2022" },
  { title: "Educational Campus", category: "Education", year: "2022" },
  { title: "Retail Plaza", category: "Retail", year: "2021" },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkButton, setIsDarkButton] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setScrolled(scrollY > 100);
          
          // Detect which section we're in to change button color
          const vh = window.innerHeight;
          const heroHeight = vh;
          const ourStoryStart = heroHeight;
          const ourStoryHeight = vh;
          const projectsStart = ourStoryStart + ourStoryHeight + vh;
          const projectsHeight = vh * 2;
          
          const inOurStory = scrollY >= ourStoryStart && scrollY < ourStoryStart + ourStoryHeight;
          const inProjects = scrollY >= projectsStart && scrollY < projectsStart + projectsHeight;
          
          setIsDarkButton(inOurStory || inProjects);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero image scale + zoom on scroll
      gsap.to(".hero-image", {
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Hero text parallax
      gsap.to(".hero-text", {
        y: 150,
        opacity: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Split-screen sections with parallax
      gsap.utils.toArray<HTMLElement>(".split-section").forEach((section) => {
        const img = section.querySelector(".split-image") as HTMLElement;
        const content = section.querySelector(".split-content") as HTMLElement;

        if (img) {
          // Image zoom + fade in
          gsap.fromTo(
            img,
            { scale: 1.4, opacity: 0, rotationY: 5 },
            {
              scale: 1,
              opacity: 1,
              rotationY: 0,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                end: "top 20%",
                scrub: 1.5,
              },
            }
          );

          // Image parallax
          gsap.to(img, {
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
            },
          });
        }

        if (content) {
          // Stagger text animations
          const heading = content.querySelector("h2");
          const subtitle = content.querySelector("h3");
          const paragraph = content.querySelector("p");

          gsap.fromTo(
            [subtitle, heading, paragraph],
            { y: 80, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 65%",
                end: "top 25%",
                scrub: 1,
              },
            }
          );
        }
      });

    // Optimized horizontal scroll for projects (right ➝ left, stable forward/back)
    const projectsContainer = document.getElementById("projects-scroll");
    const projectsSection = document.getElementById("projects");
    
    if (projectsContainer && projectsSection) {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const getDistance = () => Math.max(0, projectsContainer.scrollWidth - window.innerWidth);

      // Mobile: skip pinning to avoid blank area; allow native horizontal scroll
      if (isMobile) {
        gsap.set(projectsContainer, { x: 0, clearProps: 'transform' });
      } else {
        gsap.set(projectsContainer, { x: 0, force3D: true });
        ScrollTrigger.create({
          trigger: projectsSection,
          start: 'top top',
          pin: true,
          pinReparent: true,
          scrub: true, // eliminate easing lag on direction change
          end: () => `+=${getDistance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          scroller: document.documentElement,
          snap: 0.001, // micro-snap to avoid subpixel drift
          onUpdate: (self) => {
            const dist = (self.end as number) - (self.start as number);
            gsap.set(projectsContainer, { x: -dist * self.progress, force3D: true });
          },
          onLeaveBack: () => gsap.set(projectsContainer, { x: 0 }),
          onRefresh: () => gsap.set(projectsContainer, { x: 0 }),
        });
      }
    }

      // Parallax elements
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || "0.2");
        gsap.to(el, {
          yPercent: speed * -50,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <motion.div
        ref={containerRef}
        className="bg-white text-zinc-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo - left side, hides on scroll */}
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{
                opacity: scrolled ? 0 : 1,
                y: scrolled ? -30 : 0,
                scale: scrolled ? 0.8 : 1
              }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className={scrolled ? 'pointer-events-none' : ''}
            >
              <Link href="/" className="block -ml-2 md:-ml-4">
                {/* LOGO SIZE: Change h-24 (mobile), md:h-32 (tablet), lg:h-40 (desktop) to adjust logo size */}
                <picture>
                  <source media="(min-width: 768px)" srcSet="/logo.png?v=2" />
                  <img 
                    src="/mobile-logo.png"
                    alt="Bhagwandas and son's Constructions" 
                    className="w-auto object-contain h-24 md:h-28 lg:h-32"
                    style={{
                      filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
                    }}
                  />
                </picture>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation - center, collapses to menu button */}
            <motion.nav 
              initial={{ opacity: 1, x: 0 }}
              animate={{
                opacity: scrolled ? 0 : 1,
                x: scrolled ? 200 : 0,
                scale: scrolled ? 0.8 : 1
              }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              className={`hidden md:flex gap-8 text-base font-medium ${
                scrolled ? 'pointer-events-none' : ''
              }`}
            >
              <a href="#home" className="text-white hover:text-[#F5A623] transition-colors drop-shadow-lg whitespace-nowrap">HOME</a>
              <a href="#solutions" className="text-white hover:text-[#F5A623] transition-colors drop-shadow-lg whitespace-nowrap">SOLUTIONS</a>
              <a href="#process" className="text-white hover:text-[#F5A623] transition-colors drop-shadow-lg whitespace-nowrap">PROCESS</a>
              <a href="#projects" className="text-white hover:text-[#F5A623] transition-colors drop-shadow-lg whitespace-nowrap">PROJECTS</a>
              <a href="#about-us" className="text-white hover:text-[#F5A623] transition-colors drop-shadow-lg whitespace-nowrap">ABOUT US</a>
              <a href="#contact" className="text-white hover:text-[#F5A623] transition-colors drop-shadow-lg whitespace-nowrap">CONTACT</a>
            </motion.nav>

            {/* Mobile Menu Button - always visible on small screens */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden text-sm font-medium px-4 py-2 border rounded-full backdrop-blur-xl shadow-lg whitespace-nowrap transition-colors duration-300 ${
                isDarkButton 
                  ? 'text-zinc-900 bg-zinc-900/10 border-zinc-900/30 hover:bg-zinc-900/20'
                  : 'text-white bg-white/20 border-white/30 hover:bg-white/30'
              }`}
              aria-label="Toggle menu"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>

            {/* Menu Button - right side, appears on scroll (desktop) */}
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: scrolled ? 1 : 0,
                scale: scrolled ? 1 : 0
              }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className={`hidden md:inline-flex text-sm font-medium px-6 py-2 border rounded-full backdrop-blur-xl shadow-lg whitespace-nowrap transition-colors duration-300 ${
                isDarkButton 
                  ? 'text-zinc-900 bg-zinc-900/10 border-zinc-900/30 hover:bg-zinc-900/20'
                  : 'text-white bg-white/20 border-white/30 hover:bg-white/30'
              } ${
                scrolled ? '' : 'pointer-events-none'
              }`}
              aria-label="Toggle menu (desktop)"
            >
              {menuOpen ? "Close" : "Menu"}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Full-screen Menu Overlay with Advanced Transitions */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-40 bg-zinc-900 origin-top"
              style={{ transformOrigin: "top" }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="fixed inset-0 z-40 flex items-center justify-center"
              onClick={() => setMenuOpen(false)}
            >
              <nav className="flex flex-col gap-8 text-center">
                {["Home", "Solutions", "Process", "Projects", "About us", "Contact"].map((item, i) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="text-5xl md:text-7xl font-semibold text-white hover:text-[#F5A623] transition-colors relative overflow-hidden group"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    onClick={() => setMenuOpen(false)}
                    whileHover={{ x: 20, scale: 1.05 }}
                  >
                    <span className="relative z-10">{item}</span>
                    <motion.div
                      className="absolute inset-0 bg-[#F5A623] -z-10"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: "left" }}
                    />
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden" id="home">
        <video
          key="hero-video"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover hero-image"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
        <div className="hero-text relative z-10 flex h-full flex-col items-start justify-end px-6 md:px-12 pb-32 max-w-7xl mx-auto">
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.9] mb-6"
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            Experts since 1997
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-white/90 max-w-xl"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            Bhagwandas and son&apos;s Constructions is a comprehensive construction management team and general contractor.
          </motion.p>
        </div>
        <motion.div
          className="absolute bottom-8 md:bottom-16 right-6 md:right-12 text-white text-xs tracking-widest uppercase flex flex-col items-end gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <span className="font-medium">Scroll to discover</span>
          <div className="w-px h-16 bg-white/70 animate-pulse" />
        </motion.div>
      </section>

      {/* Split Section: Our Story */}
      <section id="solutions" className="split-section min-h-screen flex items-center py-24 px-6 md:px-12 relative overflow-hidden transition-all duration-700">
        <AnimatedBackground variant="bricks" color="#F5A623" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-zinc-50/30 to-white pointer-events-none" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="split-content">
            <h3 className="text-xs uppercase tracking-[0.25em] text-[#F5A623] mb-4 font-bold">Our story</h3>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-zinc-900">
              Quality is not only our standard. It&apos;s also an attitude instilled in our company.
            </h2>
            <p className="text-lg text-zinc-700 leading-relaxed">
              Bhagwandas and son&apos;s began in 1997 as an interior finishing contractor in the region. Since then, we&apos;ve grown to become a full-service Construction Management team and General Contractor. Though we&apos;re considerably larger, our commitment to superior quality is as strong today as ever.
            </p>
          </div>
          <div className="split-image aspect-[4/3] rounded-2xl overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#F5A623]/20 to-transparent z-10 pointer-events-none" />
            <img src="/project-1.jpg" alt="Construction site" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Split Section: Client Commitment */}
      <section id="process" className="split-section min-h-screen flex items-center py-24 px-6 md:px-12 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 relative overflow-hidden transition-all duration-700">
        <AnimatedBackground variant="geometric" color="#F5A623" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#F5A623] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F5A623] rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="split-image aspect-[4/3] rounded-2xl overflow-hidden order-2 md:order-1 relative shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tl from-[#F5A623]/20 to-transparent z-10 pointer-events-none" />
            <img src="/about-1.jpg" alt="Construction team" className="w-full h-full object-cover" />
          </div>
          <div className="split-content order-1 md:order-2">
            <h3 className="text-xs uppercase tracking-[0.25em] text-[#F5A623] mb-4 font-bold">Our client commitment</h3>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white">
              Quality construction begins with a quality relationship.
            </h2>
            <p className="text-lg text-zinc-300 leading-relaxed">
              Quality construction is more than materials and craftsmanship. It stems from the quality of the relationship between client and contractor. At Bhagwandas and son&apos;s, we&apos;re mindful of fostering a family-like atmosphere.
            </p>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Projects */}
      <section id="projects" className="min-h-screen overflow-hidden bg-gradient-to-b from-white via-zinc-50 to-white py-24 relative transition-all duration-700">
        <div className="px-6 md:px-12 mb-12">
          <motion.h3 
            className="text-xs uppercase tracking-[0.25em] text-[#F5A623] mb-4 font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Projects
          </motion.h3>
          <motion.h2 
            className="text-4xl md:text-6xl font-bold text-zinc-900"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our recent work
          </motion.h2>
          {/* Mobile scroll hint */}
          <motion.p
            className="text-sm text-zinc-500 md:hidden flex items-center gap-2 mt-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#F5A623]">
              <path d="M13 5l7 7-7 7M5 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Swipe to explore
          </motion.p>
        </div>
        <div id="projects-scroll" className="flex gap-6 px-6 md:px-12 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none">
          {projects.map((project, i) => (
            <div
              key={i}
              className="project-card flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[24vw] aspect-[3/4] min-h-[280px] rounded-2xl overflow-hidden relative p-8 flex flex-col justify-end snap-center"
            >
              <motion.img 
                src={i % 3 === 0 ? "/hero-bg.jpg" : i % 3 === 1 ? "/about-2.jpg" : "/project-2.jpg"} 
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                whileHover={{ scale: 1.1 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <motion.div 
                className="relative z-10"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="text-xs uppercase tracking-widest text-white/80 mb-2">{project.category} • {project.year}</p>
                <h3 className="text-3xl md:text-4xl font-semibold text-white">{project.title}</h3>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Who We Are Section */}
      <section id="about-us" className="min-h-screen flex items-center py-24 px-6 md:px-12 bg-white relative overflow-hidden transition-all duration-700">
        {/* Subtle animated background */}
        <AnimatedBackground variant="grid" color="#F5A623" />
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-32 -left-20 w-80 h-80 bg-[#F5A623] rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-red-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-4 font-bold">
              Who we are
            </h3>
            <div className="h-1 w-16 bg-[#F5A623] rounded-full mb-6" />
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-red-600 gpu-text">
              Our highly skilled team is always at your service.
            </h2>
            <p className="text-lg md:text-xl text-zinc-600 leading-relaxed">
              A successful project leaves nothing to chance. That&apos;s why Maman Corp. has assembled a team of experienced, highly-skilled professionals. We&apos;ve worked together for many years, and it shows. We&apos;ve also built strong relationships with vendors and subcontractors over decades—bringing our clients smarter, more efficient solutions.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { label: "Years", value: "27+" },
                { label: "Projects", value: "350+" },
                { label: "Partners", value: "120+" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="rounded-2xl border border-zinc-200 p-5 shadow-sm bg-white/60 backdrop-blur">
                  <div className="text-3xl md:text-4xl font-bold text-zinc-900">{s.value}</div>
                  <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Values */}
            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {[
                { title: "Quality", desc: "Premium materials and precise execution." },
                { title: "Safety", desc: "Strict protocols on every site." },
                { title: "Integrity", desc: "Transparent communication and budgeting." },
                { title: "On‑time", desc: "Disciplined schedules and delivery." },
              ].map((v, i) => (
                <motion.div
                  key={v.title}
                  whileHover={{ y: -4 }}
                  className="group rounded-xl border border-zinc-200 p-4 bg-white/70 shadow-sm flex gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" className="mt-1 text-[#F5A623]"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
                  <div>
                    <p className="font-semibold text-zinc-900">{v.title}</p>
                    <p className="text-sm text-zinc-600">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              className="mt-8 inline-block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <a
                href="#contact"
                className="text-sm uppercase tracking-[0.2em] font-bold text-zinc-900 border-b-2 border-zinc-900 pb-1 hover:border-[#F5A623] hover:text-[#F5A623] transition-colors"
              >
                DISCOVER MORE ABOUT WHO WE ARE
              </a>
            </motion.div>
          </motion.div>

          {/* Collage */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative h-[440px] md:h-[560px]"
          >
            <motion.img
              src="/project-1.jpg"
              alt="Team on site"
              className="absolute left-0 top-0 w-2/3 h-3/4 object-cover rounded-2xl shadow-2xl"
              whileHover={{ scale: 1.02 }}
            />
            <motion.img
              src="/about-2.jpg"
              alt="Planning"
              className="absolute right-0 bottom-0 w-2/3 h-3/4 object-cover rounded-2xl shadow-2xl"
              whileHover={{ scale: 1.02 }}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#F5A623]/10 via-transparent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="split-section min-h-screen flex items-center py-24 px-6 md:px-12 bg-gradient-to-br from-[#F5A623] to-amber-600 relative overflow-hidden transition-all duration-700">
        <AnimatedBackground variant="waves" color="#ffffff" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="split-content">
            <h3 className="text-xs uppercase tracking-[0.25em] text-white/90 mb-4 font-bold">Our vision</h3>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white">
              We go beyond the expected to find the best possible solution.
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              We combine expertise, creativity, and attention to every detail—our ingredients for over two decades of success.
            </p>
          </div>
          <div className="split-image aspect-[4/3] rounded-2xl overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent z-10 pointer-events-none" />
            <img src="/about-2.jpg" alt="Our team" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-zinc-900 text-white py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-semibold mb-8">Let&apos;s build together</h2>
          <p className="text-xl text-zinc-400 mb-12">Ready to start your next project?</p>
          <a
            href="mailto:contact@bhagwandasconstructions.com"
            className="inline-block text-lg font-medium border-b-2 border-white pb-1 hover:border-zinc-400 transition-colors"
          >
            contact@bhagwandasconstructions.com
          </a>
          <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between gap-4 text-sm text-zinc-500">
            <p>© {new Date().getFullYear()} Bhagwandas and son&apos;s Constructions</p>
            <p>Experts since 1997</p>
          </div>
        </div>
      </footer>
      </motion.div>
    </>
  );
}
