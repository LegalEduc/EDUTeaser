"use client";

import { useEffect, useState, FormEvent, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { curriculum } from "@/data/curriculum";

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
  sensitiveRevealed?: boolean;
}

interface ConsentSetting {
  lectureTopic: string;
  lectureCount: number;
  feeAmount: number;
  totalFee: number;
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
  rejected: "거절됨",
};

const BAR_LABEL: Record<string, string> = {
  judicial_exam: "사법시험",
  bar_exam: "변호사시험",
};

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
  const [lectureCount, setLectureCount] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [specialTerms, setSpecialTerms] = useState("");

  const feeAmountNumber = Number(feeAmount.replace(/,/g, ""));
  const totalFee = Number(lectureCount) > 0 && feeAmountNumber > 0
    ? Number(lectureCount) * feeAmountNumber
    : 0;
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [actionResult, setActionResult] = useState("");
  const [isRevealingSensitive, setIsRevealingSensitive] = useState(false);

  const matchedLectures = (() => {
    if (!instructor?.name) return [];
    const input = instructor.name.trim();
    if (input.length < 2) return [];
    const inputNorm = input.replace(/\s+/g, "");
    const getNoNum = (no: string) => {
      const n = parseInt(no.replace(/[^0-9]/g, ""), 10);
      return Number.isNaN(n) ? 0 : n;
    };

    return curriculum
      .filter((item) => {
        if (!item.instructor || item.instructor === "—") return false;
        const instructorText = item.instructor;
        const baseName = instructorText.split("(")[0].trim();
        const baseNorm = baseName.replace(/\s+/g, "");
        const instructorNorm = instructorText.replace(/\s+/g, "");
        return (
          baseName.includes(input) ||
          instructorText.includes(input) ||
          baseNorm.includes(inputNorm) ||
          instructorNorm.includes(inputNorm)
        );
      })
      .sort((a, b) => getNoNum(a.no) - getNoNum(b.no));
  })();

  useEffect(() => {
    // 이미 세팅된 동의서가 있으면 자동 덮어쓰기 금지
    if (consentSetting) return;
    // 사용자가 수동 입력을 시작한 경우 덮어쓰기 금지
    if (lectureTopic || lectureCount) return;
    if (matchedLectures.length === 0) return;

    setLectureCount(String(matchedLectures.length));
    const exactLectureTopics = matchedLectures.map((item) => `${item.no} ${item.part}`).join(" / ");
    const autoTopic =
      exactLectureTopics.length > 180
        ? `${matchedLectures[0].no} ${matchedLectures[0].part} 외 ${matchedLectures.length - 1}개`
        : exactLectureTopics;
    setLectureTopic(autoTopic);
  }, [consentSetting, lectureTopic, lectureCount, matchedLectures]);

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
          lectureCount: Number(lectureCount),
          feeAmount: feeAmountNumber,
          totalFee,
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
        lectureCount: Number(lectureCount),
        feeAmount: feeAmountNumber,
        totalFee,
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

  const handleFeeAmountChange = (value: string) => {
    const digits = value.replace(/,/g, "");
    if (digits === "") {
      setFeeAmount("");
      return;
    }
    if (!/^\d+$/.test(digits)) return;
    setFeeAmount(Number(digits).toLocaleString("ko-KR"));
  };

  const handleResend = async () => {
    setIsResending(true);
    setActionResult("");
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/instructors/${id}/consent`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActionResult(data.message || (data.success ? "이메일이 재발송되었습니다." : "오류가 발생했습니다."));
    } catch {
      setActionResult("네트워크 오류가 발생했습니다.");
    } finally {
      setIsResending(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("동의서 세팅을 초기화하시겠습니까? 처음부터 다시 세팅해야 합니다.")) return;

    setIsResetting(true);
    setActionResult("");
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/instructors/${id}/consent`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setConsentSetting(null);
        setConsentSignature(null);
        if (instructor) setInstructor({ ...instructor, status: "applied" });
        setActionResult("초기화되었습니다. 동의서를 다시 세팅해 주세요.");
      } else {
        setActionResult(data.message || "오류가 발생했습니다.");
      }
    } catch {
      setActionResult("네트워크 오류가 발생했습니다.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm("이 강사의 신청을 거절하시겠습니까?")) return;

    setIsRejecting(true);
    setActionResult("");
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/instructors/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      });
      const data = await res.json();
      if (data.success) {
        if (instructor) setInstructor({ ...instructor, status: "rejected" });
        setActionResult("거절 처리되었습니다.");
      } else {
        setActionResult(data.message || "오류가 발생했습니다.");
      }
    } catch {
      setActionResult("네트워크 오류가 발생했습니다.");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleRevealSensitive = async () => {
    const password = window.prompt("2차 인증을 위해 관리자 비밀번호를 입력해 주세요.");
    if (!password) return;
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    setIsRevealingSensitive(true);
    try {
      const res = await fetch(`/api/admin/instructors/${id}?includeSensitive=1`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-admin-password": password,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "민감정보 조회에 실패했습니다.");
        return;
      }
      setInstructor(data.instructor);
      setConsentSetting(data.consentSetting);
      setConsentSignature(data.consentSignature);
    } catch {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsRevealingSensitive(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-slate text-[1.05rem]">불러오는 중...</p>
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-red-400 text-[1.05rem]">{error || "강사 정보를 찾을 수 없습니다."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="border-b border-[#e2e2e2] bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="font-heading text-[18px] font-bold">
            LegalCrew <span className="italic">Admin</span>
          </h1>
          <nav className="flex gap-4 text-[1rem]">
            <Link href="/admin" className="text-slate hover:text-ink transition-colors">대시보드</Link>
            <Link href="/admin/instructors" className="text-ink font-semibold underline underline-offset-4">
              강사 관리
            </Link>
            <Link href="/admin/notices" className="text-slate hover:text-ink transition-colors">안내사항 전달</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-6 py-10">
        <Link href="/admin/instructors" className="text-[1rem] text-slate hover:text-ink mb-6 inline-block">
          &larr; 강사 목록
        </Link>

        {/* 강사 정보 */}
        <div className="bg-white border border-[#e2e2e2] shadow-airtable-soft p-6 rounded-xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-[22px] font-bold">{instructor.name}</h2>
            <span className="text-caption px-3 py-1 rounded-full bg-[#efefef] text-ink font-medium">
              {STATUS_TEXT[instructor.status] || instructor.status}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[1rem]">
            <div>
              <span className="text-slate">자격시험:</span>{" "}
              {BAR_LABEL[instructor.barExamType]} {instructor.barExamDetail}
            </div>
            <div>
              <span className="text-slate">이메일:</span> {instructor.email}
            </div>
            <div>
              <span className="text-slate">전화:</span> {formatPhone(instructor.phone)}
            </div>
            <div>
              <span className="text-slate">은행:</span> {instructor.bankName} ({instructor.accountHolder})
            </div>
            <div>
              <span className="text-slate">주민번호:</span> {instructor.residentNumber}
            </div>
            <div>
              <span className="text-slate">계좌번호:</span> {instructor.accountNumber}
            </div>
            <div>
              <span className="text-slate">주차:</span>{" "}
              {instructor.parkingNeeded ? `필요 (${instructor.carNumber})` : "불필요"}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#e2e2e2] flex items-center gap-3">
            <button
              type="button"
              onClick={handleRevealSensitive}
              disabled={isRevealingSensitive}
              className="px-4 py-2 border border-ink text-ink hover:bg-[#e2e2e2] transition-colors text-caption rounded-full disabled:opacity-50"
            >
              {isRevealingSensitive ? "확인 중..." : "2차 인증 후 원문 보기"}
            </button>
            {instructor.sensitiveRevealed ? (
              <span className="text-caption text-slate">원문이 표시 중입니다.</span>
            ) : (
              <span className="text-caption text-slate">기본값은 마스킹 처리됩니다.</span>
            )}
          </div>
          {/* 진행 날짜 */}
          <div className="mt-4 pt-4 border-t border-[#e2e2e2] flex flex-wrap gap-x-6 gap-y-2 text-[1rem]">
            <div>
              <span className="text-slate">신청일:</span>{" "}
              <span className="text-ink font-medium">{new Date(instructor.appliedAt).toLocaleDateString("ko-KR")}</span>
            </div>
            {consentSetting && (
              <div>
                <span className="text-slate">동의서 발송일:</span>{" "}
                <span className="text-ink">{new Date(consentSetting.sentAt).toLocaleDateString("ko-KR")}</span>
              </div>
            )}
            {consentSignature && (
              <div>
                <span className="text-slate">최종 서명일:</span>{" "}
                <span className="text-ink font-medium">{new Date(consentSignature.signedAt).toLocaleDateString("ko-KR")}</span>
              </div>
            )}
          </div>
          {instructor.bio && (
            <div className="mt-4 pt-4 border-t border-[#e2e2e2]">
              <p className="text-slate text-[1rem] mb-1">이력 사항</p>
              <p className="text-caption text-slate-light mb-2">
                홍보 자료 및 수강생 안내에 활용됩니다.
              </p>
              <p className="text-[1rem] whitespace-pre-wrap leading-relaxed">{instructor.bio}</p>
            </div>
          )}
          {instructor.status === "applied" && (
            <div className="mt-4 pt-4 border-t border-[#e2e2e2]">
              {actionResult && (
                <div className={`mb-4 p-3 text-caption rounded border ${
                  actionResult.includes("거절")
                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                  {actionResult}
                </div>
              )}
              <button
                onClick={handleReject}
                disabled={isRejecting}
                className="px-5 py-2 border border-red-500/30 text-red-400 text-[1rem] rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                {isRejecting ? "처리 중..." : "신청 거절"}
              </button>
            </div>
          )}
          {instructor.status === "rejected" && (
            <div className="mt-4 pt-4 border-t border-[#e2e2e2]">
              <p className="text-red-400 text-[1rem]">이 강사의 신청은 거절되었습니다.</p>
            </div>
          )}
        </div>

        {/* 동의서 세팅 */}
        {consentSetting ? (
          <div className="bg-white border border-[#e2e2e2] shadow-airtable-soft p-6 rounded-xl mb-6">
            <h3 className="font-heading text-[18px] font-bold mb-4">동의서 세팅</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[1rem]">
              <div>
                <span className="text-slate">강의 주제:</span> {consentSetting.lectureTopic}
              </div>
              <div>
                <span className="text-slate">총 강의횟수:</span> {consentSetting.lectureCount}회
              </div>
              <div>
                <span className="text-slate">강사료(1회당):</span>{" "}
                {consentSetting.feeAmount.toLocaleString()}원
              </div>
              <div>
                <span className="text-slate">총 강사료:</span>{" "}
                {consentSetting.totalFee.toLocaleString()}원
              </div>
              {consentSetting.specialTerms && (
                <div className="md:col-span-2">
                  <span className="text-slate">특약사항:</span> {consentSetting.specialTerms}
                </div>
              )}
              <div className="md:col-span-2">
                <span className="text-slate">동의서 링크:</span>{" "}
                <code className="text-ink text-caption font-mono bg-[#f3f3f3] px-2 py-0.5 rounded-lg">
                  {window.location.origin}/consent/{consentSetting.token}
                </code>
              </div>
            </div>

            {consentSignature ? (
              <div className="mt-4 pt-4 border-t border-[#e2e2e2] flex items-center justify-between">
                <p className="text-ink text-[1rem] font-medium">
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
                  className="px-4 py-2 border border-ink text-ink hover:bg-[#e2e2e2] transition-colors text-[1rem] rounded-full"
                >
                  PDF 다운로드
                </a>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-[#e2e2e2]">
                {actionResult && (
                  <div className={`mb-4 p-3 text-caption rounded border ${
                    actionResult.includes("재발송") || actionResult.includes("초기화")
                      ? "bg-[#efefef] border-[#e2e2e2] text-ink"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}>
                    {actionResult}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handleResend}
                    disabled={isResending || isResetting}
                    className="px-5 py-2 bg-gold text-white font-semibold text-caption rounded-full hover:bg-gold-light transition-colors disabled:opacity-50 shadow-airtable"
                  >
                    {isResending ? "발송 중..." : "이메일 재발송"}
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={isResending || isResetting}
                    className="px-5 py-2 border border-red-500/30 text-red-400 text-caption rounded-full hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    {isResetting ? "처리 중..." : "초기화"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : instructor.status === "applied" ? (
          <div className="bg-white border border-[#e2e2e2] shadow-airtable-soft p-6 rounded-xl mb-6">
            <h3 className="font-heading text-[18px] font-bold mb-6">동의서 세팅</h3>

            {sendResult && (
              <div className={`mb-4 p-4 text-[1rem] rounded border ${
                sendResult.includes("생성되었습니다")
                  ? "bg-[#efefef] border-[#e2e2e2] text-ink"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}>
                {sendResult}
              </div>
            )}

            <form onSubmit={handleConsentSubmit} className="space-y-4">
              <div>
                <label className="block text-[1rem] text-slate mb-2">
                  강의 주제 <span className="text-ink">*</span>
                </label>
                <input
                  type="text"
                  value={lectureTopic}
                  onChange={(e) => setLectureTopic(e.target.value)}
                  placeholder="예시: 형사 수사 대응 실무 등"
                  required
                  className="w-full bg-white border border-ink px-4 py-3 text-[1.05rem] text-ink placeholder:text-slate-light focus:ring-2 focus:ring-ink/20 focus:border-ink focus:outline-none transition-colors rounded-lg"
                />
                {matchedLectures.length > 0 && (
                  <div className="mt-2 text-caption text-slate space-y-1">
                    <p>마스터 등록 시 배정된 강의 정보로 자동 입력되었습니다.</p>
                    <p className="text-slate-light">{matchedLectures.map((item) => `${item.no} ${item.part}`).join(" / ")}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[1rem] text-slate mb-2">
                  총 강의횟수 <span className="text-ink">*</span>
                </label>
                <input
                  type="number"
                  value={lectureCount}
                  onChange={(e) => setLectureCount(e.target.value)}
                  placeholder="예: 2"
                  required
                  min="1"
                  className="w-full md:w-1/4 bg-white border border-ink px-4 py-3 text-[1.05rem] text-ink placeholder:text-slate-light focus:ring-2 focus:ring-ink/20 focus:border-ink focus:outline-none transition-colors rounded-lg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[1rem] text-slate mb-2">
                    강사료 (원/1회당) <span className="text-ink">*</span>
                  </label>
                  <input
                    type="text"
                    value={feeAmount}
                    onChange={(e) => handleFeeAmountChange(e.target.value)}
                    placeholder="1,000,000"
                    required
                    inputMode="numeric"
                    className="w-full bg-white border border-ink px-4 py-3 text-[1.05rem] text-ink placeholder:text-slate-light focus:ring-2 focus:ring-ink/20 focus:border-ink focus:outline-none transition-colors rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[1rem] text-slate mb-2">
                    총 강사료
                  </label>
                  <div className="w-full bg-white border border-ink px-4 py-3 text-[1.05rem] text-slate">
                    {totalFee > 0 ? `${totalFee.toLocaleString()}원` : "-"}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[1rem] text-slate mb-2">
                  특약사항 (선택)
                </label>
                <textarea
                  value={specialTerms}
                  onChange={(e) => setSpecialTerms(e.target.value)}
                  placeholder="특별 조건이 있으면 기재해 주세요"
                  rows={3}
                  className="w-full bg-white border border-ink px-4 py-3 text-[1.05rem] text-ink placeholder:text-slate-light focus:ring-2 focus:ring-ink/20 focus:border-ink focus:outline-none transition-colors resize-y rounded-lg"
                />
              </div>
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-3 bg-gold text-white font-semibold text-[1.05rem] rounded-full hover:bg-gold-light transition-colors disabled:opacity-50 shadow-airtable"
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
