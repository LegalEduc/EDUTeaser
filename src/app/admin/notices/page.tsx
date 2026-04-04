"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Notice {
  id: string;
  title: string;
  body: string;
  target: string;
  sentCount: number;
  createdAt: string;
}

interface InstructorRow {
  id: string;
  name: string;
  email: string;
  status: string;
}

const TARGET_LABEL: Record<string, string> = {
  all: "전체",
  consented_only: "동의완료만",
  specific: "특정 강사",
};

const STATUS_LABEL: Record<string, string> = {
  applied: "신청",
  consent_sent: "동의서 발송",
  consented: "서명 완료",
  rejected: "거절",
};

export default function NoticesPage() {
  const router = useRouter();
  const [noticesList, setNoticesList] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState<"all" | "consented_only" | "specific">("all");
  const [instructorRows, setInstructorRows] = useState<InstructorRow[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [isSending, setIsSending] = useState(false);
  const [formResult, setFormResult] = useState("");

  const fetchNotices = () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    fetch("/api/admin/notices", {
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
        if (d?.notices) setNoticesList(d.notices);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotices();
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    fetch("/api/admin/instructors", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (!d?.instructors?.length) {
          setInstructorRows([]);
          return;
        }
        const seen = new Set<string>();
        const rows: InstructorRow[] = [];
        for (const r of d.instructors as InstructorRow[]) {
          if (seen.has(r.id)) continue;
          seen.add(r.id);
          rows.push({
            id: r.id,
            name: r.name,
            email: r.email,
            status: r.status,
          });
        }
        rows.sort((a, b) => a.name.localeCompare(b.name, "ko"));
        setInstructorRows(rows);
      })
      .catch(() => setInstructorRows([]));
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setFormResult("");

    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      if (target === "specific" && selectedIds.size === 0) {
        setFormResult("특정 강사를 한 명 이상 선택해 주세요.");
        setIsSending(false);
        return;
      }

      const res = await fetch("/api/admin/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          body,
          target,
          ...(target === "specific"
            ? { instructorIds: [...selectedIds] }
            : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormResult(data.message || "오류가 발생했습니다.");
        return;
      }

      setFormResult("공지가 등록되었습니다.");
      setTitle("");
      setBody("");
      setTarget("all");
      setSelectedIds(new Set());
      fetchNotices();
    } catch {
      setFormResult("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="border-b border-[#e2e2e2] bg-white px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-[18px] font-bold">
            LegalCrew <span className="italic font-normal">Admin</span>
          </h1>
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
        <nav className="flex gap-3 text-[1rem] overflow-x-auto">
          <Link
            href="/admin"
            className="text-slate hover:text-ink transition-colors whitespace-nowrap"
          >
            대시보드
          </Link>
          <Link
            href="/admin/instructors"
            className="text-slate hover:text-ink transition-colors whitespace-nowrap"
          >
            강사 관리
          </Link>
          <Link
            href="/admin/notices"
            className="text-ink font-semibold underline underline-offset-4 whitespace-nowrap"
          >
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

      <main className="max-w-[960px] mx-auto px-6 py-10">
        <h2 className="font-heading text-[24px] font-bold mb-8">안내사항 전달</h2>

        <div className="bg-white border border-[#e2e2e2] shadow-airtable-soft p-6 rounded-xl mb-8">
          <h3 className="font-heading text-[18px] font-bold mb-6">공지 작성</h3>

          {formResult && (
            <div
              className={`mb-4 p-4 text-[1rem] rounded-lg border ${
                formResult.includes("등록되었습니다")
                  ? "bg-[#efefef] border-[#e2e2e2] text-ink"
                  : "bg-red-500/10 border-red-500/20 text-red-600"
              }`}
            >
              {formResult}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[1rem] text-slate mb-2">
                제목 <span className="text-ink">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="공지 제목"
                required
                className="w-full bg-white border border-ink px-4 py-3 text-[1.05rem] text-ink placeholder:text-slate-light focus:ring-2 focus:ring-ink/20 focus:border-ink focus:outline-none transition-colors rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[1rem] text-slate mb-2">
                내용 <span className="text-ink">*</span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="공지 내용을 작성하세요"
                required
                rows={5}
                className="w-full bg-white border border-ink px-4 py-3 text-[1.05rem] text-ink placeholder:text-slate-light focus:ring-2 focus:ring-ink/20 focus:border-ink focus:outline-none transition-colors resize-y rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[1rem] text-slate mb-3">
                발송 대상 <span className="text-ink">*</span>
              </label>
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 text-[1.05rem] cursor-pointer">
                    <input
                      type="radio"
                      checked={target === "all"}
                      onChange={() => {
                        setTarget("all");
                        setSelectedIds(new Set());
                      }}
                      className="accent-ink"
                    />
                    전체 강사
                  </label>
                  <label className="flex items-center gap-2 text-[1.05rem] cursor-pointer">
                    <input
                      type="radio"
                      checked={target === "consented_only"}
                      onChange={() => {
                        setTarget("consented_only");
                        setSelectedIds(new Set());
                      }}
                      className="accent-ink"
                    />
                    동의 완료 강사만
                  </label>
                  <label className="flex items-center gap-2 text-[1.05rem] cursor-pointer">
                    <input
                      type="radio"
                      checked={target === "specific"}
                      onChange={() => setTarget("specific")}
                      className="accent-ink"
                    />
                    특정 강사 선택
                  </label>
                </div>
                {target === "specific" && (
                  <div className="mt-2 border border-[#e2e2e2] rounded-lg p-4 max-h-[280px] overflow-y-auto">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="text-caption text-slate">
                        {selectedIds.size}명 선택됨
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedIds.size === instructorRows.length) {
                            setSelectedIds(new Set());
                          } else {
                            setSelectedIds(new Set(instructorRows.map((r) => r.id)));
                          }
                        }}
                        className="text-caption text-ink underline underline-offset-2"
                      >
                        {selectedIds.size === instructorRows.length
                          ? "전체 해제"
                          : "전체 선택"}
                      </button>
                    </div>
                    {instructorRows.length === 0 ? (
                      <p className="text-caption text-slate">강사 목록을 불러오는 중이거나 없습니다.</p>
                    ) : (
                      <ul className="space-y-2">
                        {instructorRows.map((row) => (
                          <li key={row.id}>
                            <label className="flex items-start gap-2 text-[1rem] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedIds.has(row.id)}
                                onChange={() => {
                                  setSelectedIds((prev) => {
                                    const n = new Set(prev);
                                    if (n.has(row.id)) n.delete(row.id);
                                    else n.add(row.id);
                                    return n;
                                  });
                                }}
                                className="accent-ink mt-1 shrink-0"
                              />
                              <span>
                                <span className="font-medium text-ink">{row.name}</span>
                                <span className="text-slate"> · {row.email}</span>
                                <span className="text-slate-light text-caption ml-1">
                                  ({STATUS_LABEL[row.status] || row.status})
                                </span>
                              </span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isSending}
              className="px-6 py-3 bg-gold text-white font-semibold text-[1.05rem] rounded-full hover:bg-gold-light transition-colors disabled:opacity-50 shadow-airtable"
            >
              {isSending
                ? "등록 중..."
                : target === "specific"
                  ? `선택한 ${selectedIds.size}명에게 공지 등록`
                  : "공지 등록"}
            </button>
          </form>
        </div>

        <h3 className="font-heading text-[18px] font-bold mb-4">발송 이력</h3>
        {loading ? (
          <p className="text-slate text-[1.05rem]">불러오는 중...</p>
        ) : noticesList.length === 0 ? (
          <p className="text-slate text-[1.05rem]">발송 이력이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {noticesList.map((notice) => (
              <div
                key={notice.id}
                className="bg-white border border-[#e2e2e2] shadow-airtable-soft p-5 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[1.05rem]">{notice.title}</span>
                  <span className="text-[1rem] text-slate">
                    {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="text-[1rem] text-slate line-clamp-2">{notice.body}</p>
                <div className="mt-2 flex gap-3 text-[1rem] text-slate-light">
                  <span>대상: {TARGET_LABEL[notice.target]}</span>
                  <span>발송: {notice.sentCount}건</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
