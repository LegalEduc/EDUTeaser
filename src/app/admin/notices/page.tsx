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
        if (d?.notices) setNoticesList(d.notices);
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
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-[1.05rem] cursor-pointer">
                  <input
                    type="radio"
                    checked={target === "all"}
                    onChange={() => setTarget("all")}
                    className="accent-ink"
                  />
                  전체 강사
                </label>
                <label className="flex items-center gap-2 text-[1.05rem] cursor-pointer">
                  <input
                    type="radio"
                    checked={target === "consented_only"}
                    onChange={() => setTarget("consented_only")}
                    className="accent-ink"
                  />
                  동의 완료 강사만
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSending}
              className="px-6 py-3 bg-gold text-white font-semibold text-[1.05rem] rounded-full hover:bg-gold-light transition-colors disabled:opacity-50 shadow-airtable"
            >
              {isSending ? "등록 중..." : "공지 등록"}
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
