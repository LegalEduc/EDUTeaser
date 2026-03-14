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

      {/* 히어로 — 다크 */}
      <Hero onApplyClick={openModal} />

      {/* 골드 구분선 */}
      <div className="bg-cream px-6 md:px-16">
        <div className="section-divider" />
      </div>

      {/* Problem 섹션 — 크림 */}
      <StorySection />

      {/* 골드 구분선 */}
      <div className="bg-cream-mid px-6 md:px-16">
        <div className="section-divider" />
      </div>

      {/* 프로그램 개요 — 라이트 */}
      <Overview />

      {/* 미션 — 골드 */}
      <Mission />

      {/* Statistics — 네이비 */}
      <Statistics />

      {/* 커리큘럼 — 다크 */}
      <Curriculum />

      {/* FAQ — 크림 */}
      <FAQ />

      {/* 하단 CTA — 크림 */}
      <FooterCTA onApplyClick={openModal} />

      {/* 푸터 — 다크 */}
      <Footer />

      {/* 신청 모달 */}
      <ApplyModal isOpen={modalOpen} onClose={closeModal} />
    </>
  );
}
