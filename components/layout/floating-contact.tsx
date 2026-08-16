"use client";

import { useState, useEffect, useRef } from "react";
import { PhoneCallIcon, GmailIcon, WhatsAppIcon } from "@/components/icons/brand-icons";
import { CONTACT_INFO, CONTACT_LINKS } from "@/configs/contact";
import { PhoneCall, X } from "lucide-react";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close floating speed-dial when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Dark overlay backdrop when open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      <div
        ref={containerRef}
        className="fixed bottom-6 right-6 z-[70] flex flex-col items-end gap-3 select-none"
      >
        {/* Speed dial items */}
        {isOpen && (
          <div className="flex flex-col gap-2.5 items-end animate-in fade-in slide-in-from-bottom-4 duration-200">
            <a
              href={CONTACT_LINKS.call}
              className="group flex items-center gap-3 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-xl hover:border-[#06B6A4] dark:hover:border-[#2dd4bf] hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <PhoneCallIcon className="h-4.5 w-4.5 shrink-0" />
              <span className="truncate">{CONTACT_INFO.phoneDisplay}</span>
            </a>

            <a
              href={CONTACT_LINKS.email}
              className="group flex items-center gap-3 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-xl hover:border-[#06B6A4] dark:hover:border-[#2dd4bf] hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <GmailIcon className="h-4.5 w-4.5 shrink-0" />
              <span className="truncate">{CONTACT_INFO.email}</span>
            </a>

            <a
              href={CONTACT_LINKS.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-xl hover:border-[#06B6A4] dark:hover:border-[#2dd4bf] hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <WhatsAppIcon className="h-4.5 w-4.5 shrink-0" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        )}

        {/* Main trigger button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close Quick Contact" : "Open Quick Contact"}
          aria-expanded={isOpen}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#06B6A4] text-white shadow-lg shadow-[#06B6A4]/30 hover:bg-[#08998B] hover:scale-105 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {/* Animated pulse ring when closed */}
          {!isOpen && (
            <span className="absolute -inset-0.5 rounded-full bg-[#06B6A4]/40 animate-ping pointer-events-none" />
          )}
          {isOpen ? (
            <X className="h-6 w-6 relative z-10 transition-transform duration-200 rotate-0" />
          ) : (
            <PhoneCall className="h-6 w-6 relative z-10" />
          )}
        </button>
      </div>
    </>
  );
}
