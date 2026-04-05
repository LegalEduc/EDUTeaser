"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  barExamType: "judicial_exam" | "bar_exam";
  barExamDetail: string;
  status: "applied" | "consent_sent" | "consented";
  appliedAt: string;
  feeLimit: string | null;
  feeDocNeeded: boolean | null;
  feeLimitCheckNeeded: boolean | null;
  sentAt: string | null;
  signedAt: string | null;
  /** Netlify Blobs 프로필 사진 존재 여부 */
  hasProfilePhoto?: boolean;
}

function docYnOut(v: boolean | null): string {
  if (v === null) return "미기록";
  return v ? "필요" : "불필요";
}

/** 한도공문: 값 있으면 그대로. null이어도 공문/한도 섹션을 전혀 안 쓴 사람은 불필요로 간주 */
function docYnLimitCheck(inst: Instructor): string {
  const v = inst.feeLimitCheckNeeded;
  if (v !== null) return v ? "필요" : "불필요";
  const noFinanceSection =
    inst.feeDocNeeded === null && !inst.feeLimit?.trim();
  if (noFinanceSection) return "불필요";
  return "미저장";
}

function formatFeeLimitShort(raw: string | null): string {
  if (!raw?.trim()) return "—";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return raw;
  const n = Number(digits);
  if (Number.isNaN(n)) return raw;
  return `${n.toLocaleString("ko-KR")}원`;
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

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

const VALID_STATUS_FILTERS = ["applied", "consent_sent", "consented"] as const;

export default function InstructorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const filter = useMemo(() => {
    const q = searchParams.get("status") || "";
    return VALID_STATUS_FILTERS.includes(q as (typeof VALID_STATUS_FILTERS)[number])
      ? q
      : "";
  }, [searchParams]);

  const fetchInstructors = useCallback(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLoading(false);
      return;
    }

    setListError("");
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
        return res.json().then((data) => ({ ok: res.ok, status: res.status, data }));
      })
      .then((pack) => {
        if (!pack) return;
        if (!pack.ok) {
          setInstructors([]);
          setListError(
            pack.data?.message ||
              (pack.status >= 500
                ? "서버 오류로 목록을 불러오지 못했습니다. DB 연결·환경 변수를 확인해 주세요."
                : "목록을 불러오지 못했습니다.")
          );
          return;
        }
        setInstructors(Array.isArray(pack.data?.instructors) ? pack.data.instructors : []);
      })
      .catch(() => {
        setInstructors([]);
        setListError("네트워크 오류로 목록을 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  }, [filter, router]);

  useEffect(() => {
    setLoading(true);
    fetchInstructors();
  }, [fetchInstructors]);

  const handleDeleteInstructor = async (id: string, name: string) => {
    const ok = window.confirm(
      `${name} 강사 정보를 완전 삭제하시겠습니까?\n삭제 후에는 이메일 중복 제한이 해제되어 재등록 가능합니다.`
    );
    if (!ok) return;
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    const res = await fetch(`/api/admin/instructors/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      alert(data?.message || "강사 삭제에 실패했습니다.");
      return;
    }
    alert(data?.message || "강사 정보가 삭제되었습니다.");
    setLoading(true);
    fetchInstructors();
  };

  const handleExport = async () => {
    const password = window.prompt("2차 인증을 위해 관리자 비밀번호를 입력해 주세요.");
    if (!password) return;
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    setIsExporting(true);
    try {
      const res = await fetch("/api/admin/instructors/export", {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-admin-password": password,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        let message = "엑셀 다운로드에 실패했습니다.";
        try {
          const data = JSON.parse(text) as { message?: string };
          if (data?.message) message = data.message;
        } catch {
          if (text) message = text;
        }
        alert(message);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `instructors-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

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
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 text-caption font-medium rounded-full border border-ink bg-white text-ink hover:bg-[#e2e2e2] transition-colors disabled:opacity-50"
            >
              {isExporting ? "다운로드 중..." : "엑셀 다운로드"}
            </button>
            {[
              { value: "", label: "전체" },
              { value: "applied", label: "신청" },
              { value: "consent_sent", label: "발송" },
              { value: "consented", label: "완료" },
            ].map((f) => (
              <button
                type="button"
                key={f.value}
                onClick={() => {
                  if (f.value) {
                    router.replace(`/admin/instructors?status=${f.value}`, {
                      scroll: false,
                    });
                  } else {
                    router.replace("/admin/instructors", { scroll: false });
                  }
                }}
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

        {listError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-[1rem] rounded-lg">
            {listError}
          </div>
        )}

        {loading ? (
          <p className="text-slate text-[1rem]">불러오는 중...</p>
        ) : instructors.length > 0 ? (
          <div className="space-y-3">
            {instructors.map((inst) => {
              const statusInfo = STATUS_LABEL[inst.status];
              return (
                <div
                  key={inst.id}
                  className="block bg-white border border-[#e2e2e2] p-5 rounded-xl shadow-airtable-soft hover:shadow-airtable transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Link href={`/admin/instructors/${inst.id}`} className="font-semibold text-[1.1rem] hover:underline">
                        {inst.name}
                      </Link>
                      <span className={`text-[1rem] px-2 py-0.5 rounded-full ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteInstructor(inst.id, inst.name)}
                      className="px-3 py-1.5 text-caption rounded-full border border-red-500/30 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                  <div className="mt-2 flex flex-col sm:flex-row gap-1 sm:gap-4 text-[1rem] text-slate">
                    <span>{BAR_LABEL[inst.barExamType]} {inst.barExamDetail}</span>
                    <span>{inst.email}</span>
                    <span>{formatPhone(inst.phone)}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-ink">
                    <span>
                      <span className="text-slate">한도 </span>
                      {formatFeeLimitShort(inst.feeLimit)}
                    </span>
                    <span>
                      <span className="text-slate">출강공문 </span>
                      {docYnOut(inst.feeDocNeeded)}
                    </span>
                    <span>
                      <span className="text-slate">한도공문 </span>
                      {docYnLimitCheck(inst)}
                    </span>
                    <span>
                      <span className="text-slate">프로필 사진 </span>
                      {inst.hasProfilePhoto === true
                        ? "있음"
                        : inst.hasProfilePhoto === false
                          ? "없음"
                          : "—"}
                    </span>
                  </div>
                  {/* 날짜 타임라인 */}
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[1rem]">
                    <span className="text-slate">신청 {formatDate(inst.appliedAt)}</span>
                    {inst.sentAt && <span className="text-slate">발송 {formatDate(inst.sentAt)}</span>}
                    {inst.signedAt && <span className="text-ink font-medium">서명 {formatDate(inst.signedAt)}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : !listError ? (
          <div className="text-slate text-[1rem] space-y-2">
            {filter ? (
              <>
                <p>
                  현재 보기(<strong>{filter === "applied" ? "신청" : filter === "consent_sent" ? "발송" : "완료"}</strong>
                  )에 해당하는 강사가 없습니다. 데이터가 사라진 것이 아니라, 모두 다른 단계로 넘어갔을 수 있습니다.
                </p>
                <button
                  type="button"
                  onClick={() => router.replace("/admin/instructors", { scroll: false })}
                  className="text-ink underline underline-offset-4 font-medium"
                >
                  전체 목록 보기
                </button>
              </>
            ) : (
              <p>등록된 강사가 없습니다. 신청이 접수되면 여기에 표시됩니다.</p>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}
