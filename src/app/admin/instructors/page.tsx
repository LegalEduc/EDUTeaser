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
}

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  applied: { text: "신청", color: "bg-gold/20 text-gold" },
  consent_sent: { text: "발송", color: "bg-blue-500/20 text-blue-400" },
  consented: { text: "완료", color: "bg-green-500/20 text-green-400" },
};

const BAR_LABEL: Record<string, string> = {
  judicial_exam: "사법시험",
  bar_exam: "변호사시험",
};

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
        if (d) setInstructors(d.instructors);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter, router]);

  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="font-logo text-[18px] font-semibold">
            LegalCrew <span className="italic">Admin</span>
          </h1>
          <nav className="flex gap-4 text-[13px]">
            <Link href="/admin" className="text-muted hover:text-cream transition-colors">대시보드</Link>
            <Link href="/admin/instructors" className="text-gold">강사 관리</Link>
            <Link href="/admin/notices" className="text-muted hover:text-cream transition-colors">공지 관리</Link>
          </nav>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("admin_token");
            router.replace("/admin/login");
          }}
          className="text-[13px] text-muted hover:text-cream transition-colors"
        >
          로그아웃
        </button>
      </header>

      <main className="max-w-[960px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-[24px] font-bold">강사 관리</h2>
          <div className="flex gap-2">
            {[
              { value: "", label: "전체" },
              { value: "applied", label: "신청" },
              { value: "consent_sent", label: "발송" },
              { value: "consented", label: "완료" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-1.5 text-[12px] rounded-full border transition-colors ${
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
          <p className="text-muted text-[14px]">불러오는 중...</p>
        ) : instructors.length === 0 ? (
          <p className="text-muted text-[14px]">등록된 강사가 없습니다.</p>
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
                      <span className="font-semibold text-[15px]">{inst.name}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                    <span className="text-[12px] text-muted">
                      {new Date(inst.appliedAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-4 text-[12px] text-muted">
                    <span>{BAR_LABEL[inst.barExamType]} {inst.barExamDetail}</span>
                    <span>{inst.email}</span>
                    <span>{inst.phone}</span>
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
