"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  barExamType: "judicial_exam" | "bar_exam";
  barExamDetail: string;
  status: "applied" | "consent_sent" | "consented";
  appliedAt: string;
  sentAt: string | null;
  signedAt: string | null;
}

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  applied: { text: "신청", color: "bg-[#efefef] text-ink" },
  consent_sent: { text: "발송", color: "bg-[#e2e2e2] text-ink" },
  consented: { text: "완료", color: "bg-ink text-white" },
  rejected: { text: "거절", color: "bg-red-100 text-red-700" },
};

const BAR_LABEL: Record<string, string> = {
  judicial_exam: "사법시험",
  bar_exam: "변호사시험",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("ko-KR");
}

export default function InstructorsPage() {
  const router = useRouter();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    const url = filter
      ? `/api/admin/instructors?status=${filter}`
      : "/api/admin/instructors";

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("admin_token");
          router.replace("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((d) => {
        if (d?.instructors) setInstructors(d.instructors);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter, router]);

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="border-b border-[#e2e2e2] bg-white px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-[1.125rem] font-bold">LegalCrew Admin</h1>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("admin_token");
              router.replace("/admin/login");
            }}
            className="sm:hidden text-[1rem] text-slate hover:text-ink transition-colors"
          >
            로그아웃
          </button>
        </div>
        <nav className="flex gap-4 text-sm font-medium overflow-x-auto">
          <Link href="/admin" className="text-slate hover:text-ink whitespace-nowrap transition-colors">
            대시보드
          </Link>
          <Link href="/admin/instructors" className="text-ink underline underline-offset-4 whitespace-nowrap">
            강사 관리
          </Link>
          <Link href="/admin/notices" className="text-slate hover:text-ink whitespace-nowrap transition-colors">
            안내사항 전달
          </Link>
        </nav>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("admin_token");
            router.replace("/admin/login");
          }}
          className="hidden sm:block text-[1rem] text-slate hover:text-ink transition-colors"
        >
          로그아웃
        </button>
      </header>

      <main className="max-w-[1136px] mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="font-heading text-[1.5rem]">강사 관리</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "", label: "전체" },
              { value: "applied", label: "신청" },
              { value: "consent_sent", label: "발송" },
              { value: "consented", label: "완료" },
            ].map((f) => (
              <button
                type="button"
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 text-caption font-medium rounded-full border transition-colors ${
                  filter === f.value
                    ? "border-ink bg-ink text-white"
                    : "border-[#e2e2e2] bg-[#efefef] text-ink hover:bg-[#e2e2e2]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-slate text-[1rem]">불러오는 중...</p>
        ) : instructors.length === 0 ? (
          <p className="text-slate text-[1rem]">등록된 강사가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {instructors.map((inst) => {
              const statusInfo = STATUS_LABEL[inst.status];
              return (
                <Link
                  key={inst.id}
                  href={`/admin/instructors/${inst.id}`}
                  className="block bg-white border border-[#e2e2e2] p-5 rounded-xl shadow-airtable-soft hover:shadow-airtable transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-[1.1rem]">{inst.name}</span>
                      <span className={`text-[1rem] px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col sm:flex-row gap-1 sm:gap-4 text-[1rem] text-slate">
                    <span>{BAR_LABEL[inst.barExamType]} {inst.barExamDetail}</span>
                    <span>{inst.email}</span>
                    <span>{inst.phone}</span>
                  </div>
                  {/* 날짜 타임라인 */}
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[1rem]">
                    <span className="text-slate">신청 {formatDate(inst.appliedAt)}</span>
                    {inst.sentAt && <span className="text-slate">발송 {formatDate(inst.sentAt)}</span>}
                    {inst.signedAt && <span className="text-ink font-medium">서명 {formatDate(inst.signedAt)}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
