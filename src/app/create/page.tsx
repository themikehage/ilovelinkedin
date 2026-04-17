'use client';

import Link from 'next/link';
import { ArrowLeft, EyeOff } from 'lucide-react';

function LinkedinIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="border-b border-[#E8E4DE] bg-white/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8963E] flex items-center justify-center shadow-md">
              <LinkedinIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl italic tracking-tight">ilovelinkedin</span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-sans text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      {/* Read-only message */}
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-[#6B6B6B]/8 flex items-center justify-center">
          <EyeOff className="w-10 h-10 text-[#6B6B6B]" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl italic text-[var(--foreground)] mb-4 leading-tight">
          Read-only mode
        </h1>
        <p className="text-[var(--secondary)] mb-10 font-sans text-base md:text-lg leading-relaxed max-w-md mx-auto">
          Portfolio creation is currently disabled. This platform is displaying existing portfolios only.
        </p>
        <Link href="/" className="btn-primary text-base px-8 py-4">
          <ArrowLeft className="w-5 h-5" />
          Back to portfolios
        </Link>
      </div>
    </main>
  );
}
