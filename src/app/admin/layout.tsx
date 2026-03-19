"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // 로그인 페이지는 인증 체크 스킵
    if (pathname === "/admin/login") {
      setChecked(true);
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    // JWT 만료 체크 (클라이언트 측 간이 확인)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
        return;
      }
    } catch {
      localStorage.removeItem("admin_token");
      router.replace("/admin/login");
      return;
    }

    setChecked(true);
  }, [pathname, router]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <p className="text-muted text-[1.05rem]">인증 확인 중...</p>
      </div>
    );
  }

  return <>{children}</>;
}
