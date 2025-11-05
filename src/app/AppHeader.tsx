// src/layouts/AppHeader.tsx
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, User2 } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export default function AppHeader() {
  return (
    <header
      className="
        h-14
        border-b border-slate-200 dark:border-slate-800
        bg-white/70 dark:bg-slate-950/60
        backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-slate-950/40
        grid grid-cols-[240px_1fr]
      "
    >
      {/* 좌측 로고 영역 (사이드바 폭과 정렬 맞춤) */}
      <div className="flex items-center px-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-900 dark:text-slate-100"
        >
          <div className="h-6 w-6 rounded-md bg-violet-600" />
          <span className="font-bold tracking-wide">DKMV</span>
        </Link>
      </div>

      {/* 우측 액션 */}
      <div className="flex items-center justify-end gap-2 px-4">
        {/* 다크모드 토글 */}
        <AnimatedThemeToggler className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" />

        {/* 계정 드롭다운 (더미) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <User2 className="size-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
          >
            <DropdownMenuLabel>계정</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User2 className="mr-2 size-4" />
              <span>프로필 (준비중)</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <LogIn className="mr-2 size-4" />
              <span>로그인</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <LogOut className="mr-2 size-4" />
              <span>로그아웃</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
