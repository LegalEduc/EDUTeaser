"use client";

import { useState } from "react";
import Nav from "@/components/teaser/Nav";
import Hero from "@/components/teaser/Hero";
import StorySection from "@/components/teaser/StorySection";
import Overview from "@/components/teaser/Overview";
import Mission from "@/components/teaser/Mission";
import Curriculum from "@/components/teaser/Curriculum";
import FAQ from "@/components/teaser/FAQ";
import FooterCTA from "@/components/teaser/FooterCTA";
import Footer from "@/components/teaser/Footer";
import ApplyModal from "@/components/ApplyModal";

export default function TeaserPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <Nav onApplyClick={openModal} />

      {/* 히어로 — 다크 */}
      <Hero />

      {/* 스토리 1 — 다크 */}
      <StorySection theme="dark">
        <p className="font-heading text-[clamp(22px,4.5vw,50px)] font-bold leading-[1.45] tracking-tight">
          <span className="text-muted">로스쿨을 졸업하고,</span>
          <br />
          <span className="text-muted">변호사 시험을 통과해도,</span>
          <br />
          실무 현장의 장벽은
          <br />
          여전히 높습니다.
        </p>
      </StorySection>

      {/* 스토리 2 — 라이트 */}
      <StorySection theme="light">
        <p className="font-heading text-[clamp(22px,4.5vw,50px)] font-bold leading-[1.45] tracking-tight">
          <span className="text-ink/40">정형화되지 않은 실무.</span>
          <br />
          <span className="text-ink/40">경험적 데이터의 부재.</span>
          <br />
          <br />
          그 단절을 메울
          <br />
          <span className="text-gold-dark">리걸 커리어 멘토</span>가 필요합니다.
        </p>
      </StorySection>

      {/* 스토리 3 — 라이트 */}
      <StorySection theme="light">
        <p className="font-heading text-[clamp(22px,4.5vw,50px)] font-bold leading-[1.45] tracking-tight">
          변호사님의 현장 경험과 통찰을
          <br />
          신규 변호사들에게 나눠주세요.
        </p>
        <p className="mt-8 text-[clamp(14px,1.8vw,18px)] font-light text-ink/50 leading-loose">
          실전 1년 차의 생존 전략을 집약적으로 전수하는
          <br />
          12주간의 부트캠프를 함께 만들어갑니다.
        </p>
      </StorySection>

      {/* 프로그램 개요 — 라이트 */}
      <Overview />

      {/* 미션 — 다크 */}
      <Mission />

      {/* 커리큘럼 — 다크 */}
      <Curriculum />

      {/* FAQ — 다크 */}
      <FAQ />

      {/* 하단 CTA — 라이트 */}
      <FooterCTA onApplyClick={openModal} />

      {/* 푸터 */}
      <Footer />

      {/* 신청 모달 */}
      <ApplyModal isOpen={modalOpen} onClose={closeModal} />
    </>
  );
}
