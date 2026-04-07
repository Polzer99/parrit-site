"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Nav,
  Hero,
  PainPoints,
  Services,
  CaseStudies,
  Team,
  CTAFinal,
  Footer,
  FloatingWhatsApp,
} from "@/components/sections";

export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fadeRef = useCallback((node: HTMLElement | null) => {
    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 32);
    window.addEventListener("scroll", handleScroll, { passive: true });

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    document
      .querySelectorAll(".fade-in")
      .forEach((el) => observerRef.current?.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <>
      <Nav scrolled={navScrolled} />
      <Hero fadeRef={fadeRef} />
      <PainPoints fadeRef={fadeRef} />
      <Services fadeRef={fadeRef} />
      <CaseStudies fadeRef={fadeRef} />
      <Team fadeRef={fadeRef} />
      <CTAFinal fadeRef={fadeRef} />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
