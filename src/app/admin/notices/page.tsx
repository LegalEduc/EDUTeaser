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

const TARGET_LABEL: Record<string, string> = {
  all: "전체",
  consented_only: "동의완료만",
};

export default function NoticesPage() {
  const router = useRouter();
  const [noticesList, setNoticesList] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  // 작성 폼
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState<"all" | "consented_only">("all");
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
        if (d) setNoticesList(d.notices);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotices();
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setFormResult("");

    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      const res = await fetch("/api/admin/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, body, target }),
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
      fetchNotices();
    } catch {
      setFormResult("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="font-logo text-[18px] font-semibold">
            LegalCrew <span className="italic">Admin</span>
          </h1>
          <nav className="flex gap-4 text-[13px]">
            <Link href="/admin" className="text-muted hover:text-cream transition-colors">대시보드</Link>
            <Link href="/admin/instructors" className="text-muted hover:text-cream transition-colors">강사 관리</Link>
            <Link href="/admin/notices" className="text-gold">공지 관리</Link>
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
        <h2 className="font-heading text-[24px] font-bold mb-8">공지 관리</h2>

        {/* 작성 폼 */}
        <div className="bg-ink-mid border border-white/[0.06] p-6 rounded mb-8">
          <h3 className="font-heading text-[18px] font-bold mb-6">공지 작성</h3>

          {formResult && (
            <div className={`mb-4 p-4 text-[13px] rounded border ${
              formResult.includes("등록되었습니다")
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}>
              {formResult}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] text-cream/70 mb-2">
                제목 <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="공지 제목"
                required
                className="w-full bg-ink border border-white/[0.08] px-4 py-3 text-[14px] text-cream placeholder:text-cream/20 focus:border-gold/40 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[13px] text-cream/70 mb-2">
                내용 <span className="text-gold">*</span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="공지 내용을 작성하세요"
                required
                rows={5}
                className="w-full bg-ink border border-white/[0.08] px-4 py-3 text-[14px] text-cream placeholder:text-cream/20 focus:border-gold/40 focus:outline-none transition-colors resize-y"
              />
            </div>
            <div>
              <label className="block text-[13px] text-cream/70 mb-3">
                발송 대상 <span className="text-gold">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-[14px] cursor-pointer">
                  <input
                    type="radio"
                    checked={target === "all"}
                    onChange={() => setTarget("all")}
                    className="accent-gold"
                  />
                  전체 강사
                </label>
                <label className="flex items-center gap-2 text-[14px] cursor-pointer">
                  <input
                    type="radio"
                    checked={target === "consented_only"}
                    onChange={() => setTarget("consented_only")}
                    className="accent-gold"
                  />
                  동의 완료 강사만
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSending}
              className="px-6 py-3 bg-gold text-ink font-semibold text-[14px] rounded-full hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {isSending ? "등록 중..." : "공지 등록"}
            </button>
          </form>
        </div>

        {/* 이력 */}
        <h3 className="font-heading text-[18px] font-bold mb-4">발송 이력</h3>
        {loading ? (
          <p className="text-muted text-[14px]">불러오는 중...</p>
        ) : noticesList.length === 0 ? (
          <p className="text-muted text-[14px]">발송 이력이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {noticesList.map((notice) => (
              <div
                key={notice.id}
                className="bg-ink-mid border border-white/[0.06] p-5 rounded"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[14px]">{notice.title}</span>
                  <span className="text-[12px] text-muted">
                    {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="text-[13px] text-cream/70 line-clamp-2">{notice.body}</p>
                <div className="mt-2 flex gap-3 text-[11px] text-muted">
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
