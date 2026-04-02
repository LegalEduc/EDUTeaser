"use client";

const missions = [
  {
    no: "01",
    title: "실무적 관점의 정립",
    desc: "시험형 사고에서 탈피하여, 의뢰인의 실질적 문제를 해결하는 비즈니스 해결사 관점으로 전환합니다.",
  },
  {
    no: "02",
    title: "사건 주도권 확보",
    desc: "수동적인 문서 작성자에 머물지 않고, 소송의 전체 판세를 설계하는 쟁점 설계자로 성장합니다.",
  },
  {
    no: "03",
    title: "커리어 로드맵 구축",
    desc: "3년·5년·10년 차의 전문 영역 확립과 퍼스널 브랜딩을 주도적으로 설계하는 역량을 배양합니다.",
  },
];

export default function Mission() {
  return (
    <section className="bg-cream py-[clamp(80px,10vw,120px)] border-b border-cream-dark">
      <div className="max-w-[1080px] mx-auto px-[clamp(16px,4vw,48px)]">
        <h2 className="font-heading text-[clamp(28px,4vw,44px)] font-medium text-ink leading-[1.25]">
          현장 중심 실무를 관통하는 완성형 변호사 양성
        </h2>
        <p className="mt-3 text-[1.02rem] text-slate leading-[1.8] tracking-[0.18px]">
          시험형 사고를 넘어 실무 현장을 주도하는 변호사를 만듭니다.
        </p>

        <div className="mt-10 border-t border-cream-dark">
          {missions.map((m) => (
            <div key={m.no} className="py-6 border-b border-cream-dark">
              <p className="text-[0.88rem] uppercase tracking-[0.12px] text-gold font-medium">{m.no}</p>
              <p className="mt-1 text-[1.18rem] font-medium text-ink leading-[1.4]">{m.title}</p>
              <p className="mt-2 text-[1rem] text-slate leading-[1.8] tracking-[0.18px]">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}