"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DashboardData {
  applied: number;
  consentSent: number;
  consented: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    fetch("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("admin_token");
          router.replace("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((d) => {
        if (d) setData(d);
      })
      .catch(() => setError("데이터를 불러올 수 없습니다."));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.replace("/admin/login");
  };

  const cards = data
    ? [
        { label: "신규 신청", value: data.applied, color: "text-gold" },
        { label: "동의서 발송", value: data.consentSent, color: "text-blue-400" },
        { label: "서명 완료", value: data.consented, color: "text-green-400" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-ink text-cream">
      {/* 헤더 */}
      <header className="border-b border-white/[0.06] px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center justify-between">
          <h1 className="font-logo text-[18px] font-semibold">
            LegalCrew <span className="italic">Admin</span>
          </h1>
          <button
            onClick={handleLogout}
            className="sm:hidden text-[1rem] text-muted hover:text-cream transition-colors"
          >
            로그아웃
          </button>
        </div>
        <nav className="flex gap-3 text-[1rem] overflow-x-auto">
          <Link href="/admin" className="text-gold whitespace-nowrap">대시보드</Link>
          <Link href="/admin/instructors" className="text-muted hover:text-cream transition-colors whitespace-nowrap">강사 관리</Link>
          <Link href="/admin/notices" className="text-muted hover:text-cream transition-colors whitespace-nowrap">안내사항 전달</Link>
        </nav>
        <button
          onClick={handleLogout}
          className="hidden sm:block text-[1rem] text-muted hover:text-cream transition-colors"
        >
          로그아웃
        </button>
      </header>

      {/* 콘텐츠 */}
      <main className="max-w-[960px] mx-auto px-6 py-10">
        <h2 className="font-heading text-[24px] font-bold mb-8">대시보드</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[1rem] rounded">
            {error}
          </div>
        )}

        {data ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className="bg-ink-mid border border-white/[0.06] p-6 rounded"
              >
                <p className="text-[1rem] text-muted mb-2">{card.label}</p>
                <p className={`font-number text-[36px] font-bold ${card.color}`}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          !error && <p className="text-muted text-[1.05rem]">불러오는 중...</p>
        )}

        <div className="mt-10">
          <Link
            href="/admin/instructors"
            className="inline-block px-6 py-3 border border-gold/30 text-gold hover:bg-gold/10 transition-colors text-[1.05rem] rounded-full"
          >
            강사 목록 보기 &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}
