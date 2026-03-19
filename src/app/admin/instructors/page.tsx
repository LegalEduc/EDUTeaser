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
  applied: { text: "신청", color: "bg-gold/20 text-gold" },
  consent_sent: { text: "발송", color: "bg-blue-500/20 text-blue-400" },
  consented: { text: "완료", color: "bg-green-500/20 text-green-400" },
  rejected: { text: "거절", color: "bg-red-500/20 text-red-400" },
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
    <div className="min-h-screen bg-ink text-cream">
      <header className="border-b border-white/[0.06] px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center justify-between">
          <h1 className="font-logo text-[18px] font-semibold">
            LegalCrew <span className="italic">Admin</span>
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem("admin_token");
              router.replace("/admin/login");
            }}
            className="sm:hidden text-[1rem] text-muted hover:text-cream transition-colors"
          >
            로그아웃
          </button>
        </div>
        <nav className="flex gap-3 text-[1rem] overflow-x-auto">
          <Link href="/admin" className="text-muted hover:text-cream transition-colors whitespace-nowrap">대시보드</Link>
          <Link href="/admin/instructors" className="text-gold whitespace-nowrap">강사 관리</Link>
          <Link href="/admin/notices" className="text-muted hover:text-cream transition-colors whitespace-nowrap">안내사항 전달</Link>
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("admin_token");
            router.replace("/admin/login");
          }}
          className="hidden sm:block text-[1rem] text-muted hover:text-cream transition-colors"
        >
          로그아웃
        </button>
      </header>

      <main className="max-w-[960px] mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="font-heading text-[24px] font-bold">강사 관리</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "", label: "전체" },
              { value: "applied", label: "신청" },
              { value: "consent_sent", label: "발송" },
              { value: "consented", label: "완료" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-1.5 text-[1rem] rounded-full border transition-colors ${
                  filter === f.value
                    ? "border-gold text-gold bg-gold/10"
                    : "border-white/10 text-muted hover:text-cream"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-muted text-[1.05rem]">불러오는 중...</p>
        ) : instructors.length === 0 ? (
          <p className="text-muted text-[1.05rem]">등록된 강사가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {instructors.map((inst) => {
              const statusInfo = STATUS_LABEL[inst.status];
              return (
                <Link
                  key={inst.id}
                  href={`/admin/instructors/${inst.id}`}
                  className="block bg-ink-mid border border-white/[0.06] p-5 rounded hover:border-gold/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-[1.1rem]">{inst.name}</span>
                      <span className={`text-[1rem] px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col sm:flex-row gap-1 sm:gap-4 text-[1rem] text-muted">
                    <span>{BAR_LABEL[inst.barExamType]} {inst.barExamDetail}</span>
                    <span>{inst.email}</span>
                    <span>{inst.phone}</span>
                  </div>
                  {/* 날짜 타임라인 */}
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[1rem]">
                    <span className="text-gold/70">
                      신청 {formatDate(inst.appliedAt)}
                    </span>
                    {inst.sentAt && (
                      <span className="text-blue-400/70">
                        발송 {formatDate(inst.sentAt)}
                      </span>
                    )}
                    {inst.signedAt && (
                      <span className="text-green-400/70">
                        서명 {formatDate(inst.signedAt)}
                      </span>
                    )}
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
