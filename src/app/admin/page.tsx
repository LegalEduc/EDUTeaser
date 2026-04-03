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
        { label: "신규 신청", value: data.applied, color: "text-ink" },
        { label: "동의서 발송", value: data.consentSent, color: "text-slate" },
        { label: "서명 완료", value: data.consented, color: "text-ink" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="border-b border-[#e2e2e2] bg-white px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-[1.125rem] font-bold">LegalCrew Admin</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="sm:hidden text-[1rem] text-slate hover:text-ink transition-colors"
          >
            로그아웃
          </button>
        </div>
        <nav className="flex gap-4 text-sm font-medium overflow-x-auto">
          <Link href="/admin" className="text-ink whitespace-nowrap underline underline-offset-4">
            대시보드
          </Link>
          <Link href="/admin/instructors" className="text-slate hover:text-ink whitespace-nowrap transition-colors">
            강사 관리
          </Link>
          <Link href="/admin/notices" className="text-slate hover:text-ink whitespace-nowrap transition-colors">
            안내사항 전달
          </Link>
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="hidden sm:block text-[1rem] text-slate hover:text-ink transition-colors"
        >
          로그아웃
        </button>
      </header>

      <main className="max-w-[1136px] mx-auto px-6 py-10">
        <h2 className="font-heading text-[1.5rem] mb-8">대시보드</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-[1rem] rounded-lg">
            {error}
          </div>
        )}

        {data ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className="bg-white border border-[#e2e2e2] p-6 rounded-xl shadow-airtable-soft"
              >
                <p className="text-caption text-slate mb-2">{card.label}</p>
                <p className={`text-[2.25rem] font-bold leading-none ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>
        ) : (
          !error && <p className="text-slate text-[1rem]">불러오는 중...</p>
        )}

        <div className="mt-10">
          <Link
            href="/admin/instructors"
            className="inline-flex items-center min-h-[44px] px-5 py-2.5 border border-ink text-ink hover:bg-[#e2e2e2] transition-colors text-[1rem] rounded-full font-medium"
          >
            강사 목록 보기 &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}
