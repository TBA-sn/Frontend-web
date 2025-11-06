"use client";

import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FlaskConical } from "lucide-react";

/**
 * 좌하단 고정 버튼: /extension-demo 로 이동
 * - 포털 렌더로 부모의 overflow/transform 영향 제거
 * - safe-area(inset) 고려
 * - /extension-demo 경로에선 자동 숨김
 */
export default function FloatingExtensionDemoButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isExtensionDemo = pathname.startsWith("/extension-demo");

  if (typeof document === "undefined" || isExtensionDemo) return null;

  return createPortal(
    <div
      className="
        fixed z-[9999]
        pointer-events-none
        left-[max(theme(spacing.6),env(safe-area-inset-left))]
        bottom-[max(theme(spacing.6),env(safe-area-inset-bottom))]
      "
    >
      <Button
        size="lg"
        onClick={() => navigate("/extension-demo")}
        className="
          pointer-events-auto
          h-16 w-16 rounded-lg shadow-lg
          bg-violet-600 hover:bg-violet-500 text-white
        "
        aria-label="Extension Demo로 이동"
        title="Extension Demo로 이동"
      >
        <FlaskConical className="size-5" />
      </Button>
      {/* 라벨 */}
      <div
        className="
          text-center pointer-events-none
        "
        aria-hidden="true"
      >
        <span
          className="
            inline-block px-2 py-0.5 rounded-md
            text-[11px] font-medium tracking-wide
            text-white
            bg-black/40 dark:bg-black/30
            backdrop-blur-[2px]
          "
        >
          익스텐션으로
        </span>
      </div>
    </div>,
    document.body
  );
}
