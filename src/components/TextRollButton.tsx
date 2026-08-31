"use client";

import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type TextRollButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "ink" | "accent" | "ghost";
  className?: string;
  arrowOnLight?: boolean;
};

const ease = "duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]";

export function TextRollButton({
  href,
  children,
  variant = "accent",
  className = "",
  arrowOnLight = false,
}: TextRollButtonProps) {
  const styles =
    variant === "accent"
      ? "bg-accent hover:bg-cta-hover text-white"
      : variant === "ink"
        ? "bg-ink hover:bg-ink-soft text-white"
        : "bg-white text-ink border border-line hover:bg-paper-soft";

  const circleBg = arrowOnLight || variant === "ghost" ? "bg-accent" : "bg-white";
  const arrowColor =
    arrowOnLight || variant === "ghost" ? "text-white" : "text-accent";

  return (
    <a
      href={href}
      data-cursor="interactive"
      className={`group inline-flex items-center gap-2 rounded-full pl-5 pr-2 py-2 text-[13px] font-medium sm:pl-6 sm:text-[14px] ${styles} ${className}`}
    >
      <span className="relative h-[20px] overflow-hidden">
        <span
          className={`flex flex-col transition-transform ${ease} group-hover:-translate-y-1/2`}
        >
          <span className="leading-[20px]">{children}</span>
          <span className="leading-[20px]" aria-hidden>
            {children}
          </span>
        </span>
      </span>
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8 ${circleBg}`}
      >
        <ArrowRight
          size={14}
          className={`${arrowColor} transition-transform ${ease} group-hover:-rotate-45`}
        />
      </span>
    </a>
  );
}
