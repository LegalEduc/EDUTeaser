"use client";

import { useEffect, useState, FormEvent, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface InstructorDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  barExamType: string;
  barExamDetail: string;
  bio: string;
  bankName: string;
  accountHolder: string;
  residentNumber: string;
  accountNumber: string;
  parkingNeeded: boolean;
  carNumber: string | null;
  status: string;
  appliedAt: string;
}

interface ConsentSetting {
  lectureTopic: string;
  feeAmount: number;
  specialTerms: string | null;
  token: string;
  sentAt: string;
}

interface ConsentSignature {
  signedName: string;
  signedAt: string;
}

const STATUS_TEXT: Record<string, string> = {
  applied: "신청 완료",
  consent_sent: "동의서 발송됨",
  consented: "서명 완료",
};

const BAR_LABEL: Record<string, string> = {
  judicial_exam: "사법시험",
  bar_exam: "변호사시험",
};

export default function InstructorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [instructor, setInstructor] = useState<InstructorDetail | null>(null);
  const [consentSetting, setConsentSetting] = useState<ConsentSetting | null>(null);
  const [consentSignature, setConsentSignature] = useState<ConsentSignature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 동의서 세팅 폼
  const [lectureTopic, setLectureTopic] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [specialTerms, setSpecialTerms] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    fetch(`/api/admin/instructors/${id}`, {
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
        if (d && !d.message) {
          setInstructor(d.instructor);
          setConsentSetting(d.consentSetting);
          setConsentSignature(d.consentSignature);
        } else if (d?.message) {
          setError(d.message);
        }
      })
      .catch(() => setError("데이터를 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleConsentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendResult("");

    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/instructors/${id}/consent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lectureTopic,
          feeAmount: Number(feeAmount),
          specialTerms: specialTerms || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSendResult(data.message || "오류가 발생했습니다.");
        return;
      }

      const baseUrl = window.location.origin;
      setSendResult(`동의서 링크가 생성되었습니다: ${baseUrl}/consent/${data.token}`);
      setConsentSetting({
        lectureTopic,
        feeAmount: Number(feeAmount),
        specialTerms: specialTerms || null,
        token: data.token,
        sentAt: new Date().toISOString(),
      });
      if (instructor) {
        setInstructor({ ...instructor, status: "consent_sent" });
      }
    } catch {
      setSendResult("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <p className="text-muted text-[1.05rem]">불러오는 중...</p>
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <p className="text-red-400 text-[1.05rem]">{error || "강사 정보를 찾을 수 없습니다."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      <header className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="font-logo text-[18px] font-semibold">
            LegalCrew <span className="italic">Admin</span>
          </h1>
          <nav className="flex gap-4 text-[1rem]">
            <Link href="/admin" className="text-muted hover:text-cream transition-colors">대시보드</Link>
            <Link href="/admin/instructors" className="text-gold">강사 관리</Link>
            <Link href="/admin/notices" className="text-muted hover:text-cream transition-colors">안내사항 전달</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-6 py-10">
        <Link href="/admin/instructors" className="text-[1rem] text-muted hover:text-cream mb-6 inline-block">
          &larr; 강사 목록
        </Link>

        {/* 강사 정보 */}
        <div className="bg-ink-mid border border-white/[0.06] p-6 rounded mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-[22px] font-bold">{instructor.name}</h2>
            <span className="text-[1rem] px-3 py-1 rounded-full bg-gold/20 text-gold">
              {STATUS_TEXT[instructor.status] || instructor.status}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[1rem]">
            <div>
              <span className="text-muted">자격시험:</span>{" "}
              {BAR_LABEL[instructor.barExamType]} {instructor.barExamDetail}
            </div>
            <div>
              <span className="text-muted">이메일:</span> {instructor.email}
            </div>
            <div>
              <span className="text-muted">전화:</span> {instructor.phone}
            </div>
            <div>
              <span className="text-muted">은행:</span> {instructor.bankName} ({instructor.accountHolder})
            </div>
            <div>
              <span className="text-muted">주민번호:</span> {instructor.residentNumber}
            </div>
            <div>
              <span className="text-muted">계좌번호:</span> {instructor.accountNumber}
            </div>
            <div>
              <span className="text-muted">주차:</span>{" "}
              {instructor.parkingNeeded ? `필요 (${instructor.carNumber})` : "불필요"}
            </div>
          </div>
          {/* 진행 날짜 */}
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap gap-x-6 gap-y-2 text-[1rem]">
            <div>
              <span className="text-muted">신청일:</span>{" "}
              <span className="text-gold">{new Date(instructor.appliedAt).toLocaleDateString("ko-KR")}</span>
            </div>
            {consentSetting && (
              <div>
                <span className="text-muted">동의서 발송일:</span>{" "}
                <span className="text-blue-400">{new Date(consentSetting.sentAt).toLocaleDateString("ko-KR")}</span>
              </div>
            )}
            {consentSignature && (
              <div>
                <span className="text-muted">최종 서명일:</span>{" "}
                <span className="text-green-400">{new Date(consentSignature.signedAt).toLocaleDateString("ko-KR")}</span>
              </div>
            )}
          </div>
          {instructor.bio && (
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <p className="text-muted text-[1rem] mb-1">이력 사항</p>
              <p className="text-[1rem] whitespace-pre-wrap leading-relaxed">{instructor.bio}</p>
            </div>
          )}
        </div>

        {/* 동의서 세팅 */}
        {consentSetting ? (
          <div className="bg-ink-mid border border-white/[0.06] p-6 rounded mb-6">
            <h3 className="font-heading text-[18px] font-bold mb-4">동의서 세팅</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[1rem]">
              <div>
                <span className="text-muted">강의 주제:</span> {consentSetting.lectureTopic}
              </div>
              <div>
                <span className="text-muted">강사료:</span>{" "}
                {consentSetting.feeAmount.toLocaleString()}원
              </div>
              {consentSetting.specialTerms && (
                <div className="md:col-span-2">
                  <span className="text-muted">특약사항:</span> {consentSetting.specialTerms}
                </div>
              )}
              <div className="md:col-span-2">
                <span className="text-muted">동의서 링크:</span>{" "}
                <code className="text-gold text-[1rem]">
                  {window.location.origin}/consent/{consentSetting.token}
                </code>
              </div>
            </div>

            {consentSignature && (
              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <p className="text-green-400 text-[1rem]">
                  서명 완료: {consentSignature.signedName} ({new Date(consentSignature.signedAt).toLocaleDateString("ko-KR")})
                </p>
                <a
                  href={`/api/admin/instructors/${id}/pdf`}
                  onClick={(e) => {
                    e.preventDefault();
                    const token = localStorage.getItem("admin_token");
                    fetch(`/api/admin/instructors/${id}/pdf`, {
                      headers: { Authorization: `Bearer ${token}` },
                    })
                      .then((res) => res.blob())
                      .then((blob) => {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `consent-${instructor.name}.pdf`;
                        a.click();
                        URL.revokeObjectURL(url);
                      });
                  }}
                  className="px-4 py-2 border border-gold/30 text-gold hover:bg-gold/10 transition-colors text-[1rem] rounded-full"
                >
                  PDF 다운로드
                </a>
              </div>
            )}
          </div>
        ) : instructor.status === "applied" ? (
          <div className="bg-ink-mid border border-white/[0.06] p-6 rounded mb-6">
            <h3 className="font-heading text-[18px] font-bold mb-6">동의서 세팅</h3>

            {sendResult && (
              <div className={`mb-4 p-4 text-[1rem] rounded border ${
                sendResult.includes("생성되었습니다")
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}>
                {sendResult}
              </div>
            )}

            <form onSubmit={handleConsentSubmit} className="space-y-4">
              <div>
                <label className="block text-[1rem] text-cream/70 mb-2">
                  강의 주제 <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  value={lectureTopic}
                  onChange={(e) => setLectureTopic(e.target.value)}
                  placeholder="예: 형사 수사 대응 실무"
                  required
                  className="w-full bg-ink border border-white/[0.08] px-4 py-3 text-[1.05rem] text-cream placeholder:text-cream/20 focus:border-gold/40 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[1rem] text-cream/70 mb-2">
                  강사료 (원) <span className="text-gold">*</span>
                </label>
                <input
                  type="number"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  placeholder="500000"
                  required
                  min="1"
                  className="w-full md:w-1/2 bg-ink border border-white/[0.08] px-4 py-3 text-[1.05rem] text-cream placeholder:text-cream/20 focus:border-gold/40 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[1rem] text-cream/70 mb-2">
                  특약사항 (선택)
                </label>
                <textarea
                  value={specialTerms}
                  onChange={(e) => setSpecialTerms(e.target.value)}
                  placeholder="특별 조건이 있으면 기재해 주세요"
                  rows={3}
                  className="w-full bg-ink border border-white/[0.08] px-4 py-3 text-[1.05rem] text-cream placeholder:text-cream/20 focus:border-gold/40 focus:outline-none transition-colors resize-y"
                />
              </div>
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-3 bg-gold text-ink font-semibold text-[1.05rem] rounded-full hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                {isSending ? "처리 중..." : "동의서 세팅 + 링크 생성"}
              </button>
            </form>
          </div>
        ) : null}
      </main>
    </div>
  );
}
