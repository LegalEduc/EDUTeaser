"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "로그인에 실패했습니다.");
        return;
      }

      localStorage.setItem("admin_token", data.token);
      router.push("/admin");
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] rounded-xl bg-white p-8 shadow-airtable border border-[#e2e2e2]">
        <div className="text-center mb-10">
          <p className="text-caption font-medium text-slate mb-2">Admin</p>
          <h1 className="font-heading text-[1.75rem] text-ink leading-tight">관리자 로그인</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-[1rem] rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[1rem] text-slate mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="관리자 비밀번호를 입력하세요"
              required
              autoFocus
              className="w-full bg-white border border-ink px-4 py-3 text-[1rem] text-ink placeholder:text-slate-light focus:outline-none focus:ring-2 focus:ring-ink/20 rounded-lg"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[44px] py-3 bg-gold text-white font-semibold text-[1rem] rounded-full hover:bg-gold-light transition-colors disabled:opacity-50 shadow-airtable"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
