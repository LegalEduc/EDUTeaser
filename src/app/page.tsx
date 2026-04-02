"use client";

import { useState, useEffect } from "react";
import Nav from "@/components/teaser/Nav";
import Hero from "@/components/teaser/Hero";
import StorySection from "@/components/teaser/StorySection";
import Overview from "@/components/teaser/Overview";
import Mission from "@/components/teaser/Mission";
import Statistics from "@/components/teaser/Statistics";
import Curriculum from "@/components/teaser/Curriculum";
import FAQ from "@/components/teaser/FAQ";
import FooterCTA from "@/components/teaser/FooterCTA";
import Footer from "@/components/teaser/Footer";
import ApplyModal from "@/components/ApplyModal";

export default function TeaserPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Scroll progress bar
  useEffect(() => {
    const bar = document.getElementById("progress-bar");
    if (!bar) return;
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div id="progress-bar" />

      <Nav onApplyClick={openModal} />

      <Hero onApplyClick={openModal} />

      <div className="bg-cream px-6 md:px-16">
        <div className="section-divider" />
      </div>

      <StorySection />

      <div className="bg-cream-mid px-6 md:px-16">
        <div className="section-divider" />
      </div>

      <Overview />
      <Mission />
      <Statistics />
      <Curriculum />
      <FAQ />
      <FooterCTA onApplyClick={openModal} />
      <Footer />

      {/* 신청 모달 */}
      <ApplyModal isOpen={modalOpen} onClose={closeModal} />
    </>
  );
}
