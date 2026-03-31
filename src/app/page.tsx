'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Job, THEMES, MAX_PORTFOLIOS_PER_USER } from '@/lib/types';
import {
  Plus,
  Loader2,
  Check,
  X,
  ExternalLink,
  Copy,
  RefreshCw,
  Sparkle,
  AlertCircle,
  Grid3X3,
  ArrowRight,
  Star,
  ChevronRight,
} from 'lucide-react';

// LinkedIn SVG Icon
function LinkedinIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function getOrCreateUserUuid(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem('ilovelinkedin_user_uuid');
  if (stored) return stored;
  const newUuid = crypto.randomUUID();
  localStorage.setItem('ilovelinkedin_user_uuid', newUuid);
  return newUuid;
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; bg: string; label: string }> = {
    PENDING: { label: 'Pending', color: '#6B6B6B', bg: '#F5F5F5' },
    SCRAPING: { label: 'Scraping', color: '#2563EB', bg: '#EFF6FF' },
    BUILDING: { label: 'Building', color: '#7C3AED', bg: '#F5F3FF' },
    DEPLOYING: { label: 'Deploying', color: '#C8963E', bg: '#FFFBEB' },
    EVALUATING: { label: 'Evaluating', color: '#0891B2', bg: '#ECFEFF' },
    DONE: { label: 'Live', color: '#4A7C59', bg: '#F0FDF4' },
    FAILED: { label: 'Failed', color: '#C25450', bg: '#FEF2F2' },
  };
  const c = config[status] || config.PENDING;
  return (
    <span
      className={`status-badge ${!['DONE', 'FAILED'].includes(status) ? 'processing' : ''}`}
      style={{ color: c.color, backgroundColor: c.bg }}
    >
      {status === 'SCRAPING' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {status === 'DONE' && <Check className="w-3.5 h-3.5" />}
      {status === 'FAILED' && <X className="w-3.5 h-3.5" />}
      {!['SCRAPING', 'DONE', 'FAILED'].includes(status) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {c.label}
    </span>
  );
}

// ─── Portfolio Card ─────────────────────────────────────────────────────────

function PortfolioCard({ job, onCopy, onRefresh }: { job: Job; onCopy: (url: string) => void; onRefresh: () => void }) {
  const isTerminal = job.status === 'DONE' || job.status === 'FAILED';
  const theme = THEMES.find(t => t.id === job.theme);
  const createdDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const scrapedData = job.scrapedData as Record<string, unknown> | null;
  const scrapedName = scrapedData?.name as string | null;
  const scrapedHeadline = scrapedData?.headline as string | null;
  const scrapedLocation = scrapedData?.location as string | null;
  const scrapedSkills = (scrapedData?.skills as string[] | null) || [];
  const scrapedExperience = scrapedData?.experience as Array<{title?: string; company?: string}> | null;
  const hasScrapedData = scrapedData && Object.keys(scrapedData).length > 0;

  return (
    <Link href={`/portfolio/${job.id}`} className="block group">
      <div className="card-surface p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: theme?.colors.primary || '#1C1C1E' }}
            >
              <LinkedinIcon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              {hasScrapedData && scrapedName ? (
                <p className="font-display font-semibold text-sm text-[var(--foreground)] truncate max-w-[160px]">
                  {scrapedName}
                </p>
              ) : (
                <p className="font-mono text-xs text-[var(--secondary)] truncate max-w-[160px]">
                  {job.linkedinUrl.replace('https://', '').replace('http://', '')}
                </p>
              )}
              <p className="text-xs text-[var(--secondary)] mt-0.5">{createdDate}</p>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>

        {hasScrapedData && job.status !== 'PENDING' && (
          <div className="mb-4 p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E4DE] flex-1">
            {scrapedHeadline && (
              <p className="text-xs text-[var(--secondary)] mb-1.5 line-clamp-2 font-sans">
                {scrapedHeadline}
              </p>
            )}
            {scrapedLocation && (
              <p className="text-xs text-[var(--secondary)] mb-2 flex items-center gap-1">
                <span>📍</span> {scrapedLocation}
              </p>
            )}
            {scrapedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {scrapedSkills.slice(0, 4).map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold font-sans"
                    style={{
                      backgroundColor: `${theme?.colors.primary}15` || '#f0f0f0',
                      color: theme?.colors.primary || '#666',
                    }}
                  >
                    {skill}
                  </span>
                ))}
                {scrapedSkills.length > 4 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FAF8F5] text-[var(--secondary)] font-sans">
                    +{scrapedSkills.length - 4}
                  </span>
                )}
              </div>
            )}
            {scrapedExperience && scrapedExperience.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#E8E4DE]">
                <p className="text-[10px] text-[var(--secondary)] font-sans">
                  {scrapedExperience[0]?.title} · {scrapedExperience[0]?.company}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto">
          <div className="mb-3">
            <p className="text-sm font-display font-semibold text-[var(--foreground)]">
              {theme?.name || job.theme}
            </p>
            {job.errorMessage && (
              <p className="text-xs text-[#C25450] mt-2 flex items-start gap-1.5 font-sans">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                {job.errorMessage}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {job.status === 'DONE' && job.deployedUrl && (
              <>
                <a
                  href={job.deployedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-1 !py-2 !px-4 text-sm font-sans"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                  View
                </a>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCopy(job.deployedUrl!); }}
                  className="btn-secondary !py-2 !px-3"
                  title="Copy link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </>
            )}
            {job.status === 'FAILED' && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRefresh(); }}
                className="btn-secondary flex-1 !py-2 !px-4 text-sm font-sans"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            )}
            {!isTerminal && (
              <div className="flex-1 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#C8963E]" />
                <span className="text-sm text-[var(--secondary)] font-sans">Building...</span>
              </div>
            )}
            {job.status === 'DONE' && (
              <span className="text-xs text-[var(--secondary)] flex items-center gap-1 font-sans ml-auto">
                Details
                <ChevronRight className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="text-center py-20 animate-fade-up">
      <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-[#C8963E]/8 flex items-center justify-center">
        <Sparkle className="w-12 h-12 text-[#C8963E] animate-float" />
      </div>
      <h3 className="font-display text-3xl text-[var(--foreground)] mb-3 italic">
        No portfolios yet
      </h3>
      <p className="text-[var(--secondary)] max-w-sm mx-auto mb-10 font-sans text-base leading-relaxed">
        Connect your LinkedIn profile and we&apos;ll transform it into a stunning portfolio page.
      </p>
      <Link href="/create" className="btn-primary text-base px-8 py-4">
        <Plus className="w-5 h-5" />
        Create Your First Portfolio
      </Link>
    </div>
  );
}

// ─── Showcase Card ──────────────────────────────────────────────────────────

interface ShowcasePortfolio {
  id: string;
  linkedinUrl: string;
  theme: string;
  deployedUrl: string;
  createdAt: string;
  scrapedData: Record<string, unknown> | null;
}

function ShowcaseCard({ portfolio }: { portfolio: ShowcasePortfolio }) {
  const theme = THEMES.find(t => t.id === portfolio.theme);
  const name = portfolio.scrapedData?.name as string || 'Portfolio';
  const headline = portfolio.scrapedData?.headline as string || theme?.name || '';
  const displayUrl = portfolio.linkedinUrl.replace('https://', '').replace('http://', '').replace('www.', '');

  return (
    <a
      href={portfolio.deployedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block showcase-card rounded-2xl overflow-hidden"
    >
      <div
        className="shadow-md hover:shadow-2xl transition-shadow duration-500"
        style={{
          background: `linear-gradient(145deg, ${theme?.colors.primary || '#1C1C1E'} 0%, ${theme?.colors.primary || '#1C1C1E'}dd 100%)`
        }}
      >
        {/* Browser chrome */}
        <div className="px-4 py-3 flex items-center gap-2 bg-black/15">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="w-3 h-3 rounded-full bg-white/15" />
            <div className="w-3 h-3 rounded-full bg-white/15" />
          </div>
          <div className="flex-1 mx-3">
            <div className="bg-black/20 rounded-md px-3 py-1 text-[10px] text-white/50 font-mono truncate">
              {portfolio.deployedUrl.replace('https://', '')}
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <LinkedinIcon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-semibold text-white text-base leading-tight truncate">{name}</p>
              <p className="text-white/60 text-xs font-sans truncate">{headline}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <div className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs backdrop-blur-sm font-sans">
              {theme?.name}
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/40 text-xs">
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-mono truncate">{displayUrl}</span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#C8963E]/0 group-hover:bg-[#C8963E]/8 transition-all duration-500 flex items-center justify-center rounded-2xl">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 backdrop-blur-sm rounded-xl px-5 py-2.5 flex items-center gap-2 text-[#C8963E] font-display font-semibold text-sm shadow-xl transform scale-90 group-hover:scale-100">
            <ExternalLink className="w-4 h-4" />
            View Portfolio
          </div>
        </div>
      </div>
    </a>
  );
}

// ─── Header ─────────────────────────────────────────────────────────────────

function Header({ atLimit }: { atLimit: boolean }) {
  return (
    <header className="border-b border-[#E8E4DE] bg-white/70 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C8963E] flex items-center justify-center shadow-md">
            <LinkedinIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl italic tracking-tight">ilovelinkedin</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#showcase"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-sans font-medium text-[var(--secondary)] hover:text-[var(--foreground)] hover:bg-[#FAF8F5] transition-all duration-200"
          >
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden sm:inline">Showcase</span>
          </a>
          <Link
            href="/create"
            className={`${atLimit ? 'btn-secondary opacity-50 cursor-not-allowed pointer-events-none' : 'btn-primary'}`}
            title={atLimit ? `Maximum of ${MAX_PORTFOLIOS_PER_USER} portfolios reached` : 'Create new portfolio'}
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create Portfolio</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 deco-number opacity-30 select-none pointer-events-none -translate-y-8 translate-x-4 md:translate-x-8" aria-hidden="true">
        01
      </div>
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#C8963E]/5 blur-3xl" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8963E]/8 text-[#C8963E] text-sm font-sans font-medium mb-8 animate-fade-up">
            <Sparkle className="w-4 h-4" />
            Portfolio Generator
          </div>

          {/* Headline — asymmetric left-aligned */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-[var(--foreground)] mb-6 leading-[1.05] tracking-tight animate-fade-up animate-stagger-1">
            Turn your LinkedIn
            <br />
            into a{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#C8963E]">stunning</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2 8C50 4 150 4 198 8" stroke="#C8963E" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
              </svg>
            </span>{" "}
            portfolio
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-[var(--secondary)] max-w-xl mb-10 font-sans leading-relaxed animate-fade-up animate-stagger-2">
            Paste your LinkedIn URL, pick a theme, and get a beautiful portfolio page in minutes. Free, fast, impressive.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 animate-fade-up animate-stagger-3">
            <Link href="/create" className="btn-primary text-base px-8 py-4 shadow-glow">
              <Sparkle className="w-5 h-5" />
              Create Your Portfolio — Free
            </Link>
            <a
              href="#showcase"
              className="inline-flex items-center gap-2 text-[var(--secondary)] hover:text-[var(--foreground)] font-sans font-medium transition-colors duration-200 group"
            >
              See examples
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6 mt-16 md:mt-20">
        <div className="divider" />
      </div>
    </section>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userUuid, setUserUuid] = useState('');
  const [showcasePortfolios, setShowcasePortfolios] = useState<ShowcasePortfolio[]>([]);
  const [isLoadingShowcase, setIsLoadingShowcase] = useState(true);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setUserUuid(getOrCreateUserUuid());
  }, []);

  const fetchJobs = useCallback(async () => {
    if (!userUuid) return;
    try {
      const res = await fetch('/api/jobs', {
        headers: { 'x-user-uuid': userUuid },
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userUuid]);

  useEffect(() => {
    if (userUuid) fetchJobs();
  }, [userUuid, fetchJobs]);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setShowcasePortfolios(data.portfolios || []);
        setIsLoadingShowcase(false);
      })
      .catch(() => setIsLoadingShowcase(false));
  }, []);

  useEffect(() => {
    if (jobs.length === 0) return;
    const activeJobs = jobs.filter(j => !['DONE', 'FAILED'].includes(j.status));
    if (activeJobs.length === 0) return;

    pollingRef.current = setInterval(() => {
      fetchJobs();
    }, 5000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [jobs, fetchJobs]);

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      console.error('Failed to copy');
    }
  };

  const activeCount = jobs.filter(j => !['DONE', 'FAILED'].includes(j.status)).length;
  const doneCount = jobs.filter(j => j.status === 'DONE').length;
  const atLimit = jobs.length >= MAX_PORTFOLIOS_PER_USER;

  return (
    <main className="min-h-screen">
      <Header atLimit={atLimit} />
      <Hero />

      {/* Portfolios Section */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-10 animate-fade-up">
          <div>
            <h2 className="font-display text-3xl md:text-4xl italic text-[var(--foreground)]">Your Portfolios</h2>
            <div className="gold-line mt-3" />
          </div>
          {jobs.length > 0 && (
            <div className="flex items-center gap-5 text-sm font-sans">
              {activeCount > 0 && (
                <span className="flex items-center gap-1.5 text-[#C8963E]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {activeCount} building
                </span>
              )}
              {doneCount > 0 && (
                <span className="flex items-center gap-1.5 text-[#4A7C59]">
                  <Check className="w-4 h-4" />
                  {doneCount} live
                </span>
              )}
              <span className="text-[var(--secondary)] tabular-nums">
                {jobs.length}/{MAX_PORTFOLIOS_PER_USER}
              </span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="card-surface p-6 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl skeleton" />
                    <div className="space-y-2">
                      <div className="h-3 w-32 rounded skeleton" />
                      <div className="h-2 w-20 rounded skeleton" />
                    </div>
                  </div>
                  <div className="h-6 w-16 rounded-full skeleton" />
                </div>
                <div className="h-3 w-24 rounded skeleton mb-4" />
                <div className="h-9 w-full rounded-xl skeleton" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, i) => (
              <div key={job.id} style={{ animationDelay: `${i * 0.08}s` }} className="animate-fade-up">
                <PortfolioCard
                  job={job}
                  onCopy={handleCopy}
                  onRefresh={fetchJobs}
                />
              </div>
            ))}

            {!atLimit && (
              <Link
                href="/create"
                className="card-surface p-6 flex flex-col items-center justify-center gap-4 text-center min-h-[220px] border-dashed border-2 border-[#E8E4DE] hover:border-[#C8963E] cursor-pointer group animate-fade-up"
                style={{ animationDelay: `${jobs.length * 0.08}s` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] flex items-center justify-center group-hover:bg-[#C8963E]/10 transition-colors duration-300">
                  <Plus className="w-7 h-7 text-[var(--secondary)] group-hover:text-[#C8963E] transition-colors duration-300" />
                </div>
                <div>
                  <p className="font-display font-semibold text-lg text-[var(--foreground)] italic">Create another</p>
                  <p className="text-sm text-[var(--secondary)] font-sans mt-1">Add another portfolio</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--secondary)] group-hover:text-[#C8963E] group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="border-t border-[#E8E4DE] bg-white py-20 md:py-28">
        {/* Decorative number */}
        <div className="absolute left-0 deco-number opacity-20 select-none pointer-events-none" style={{marginTop: '-80px'}} aria-hidden="true">
          02
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-14 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8963E]/8 text-[#C8963E] text-sm font-sans font-medium mb-5">
              <Star className="w-4 h-4" />
              Community Showcase
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl italic text-[var(--foreground)] mb-4 leading-tight">
              See what others
              <br />
              are building
            </h2>
            <p className="text-[var(--secondary)] max-w-lg mx-auto font-sans text-base md:text-lg leading-relaxed">
              Real portfolios created from LinkedIn profiles. Get inspired and create yours.
            </p>
          </div>

          {isLoadingShowcase ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-2xl h-48 skeleton" style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
          ) : showcasePortfolios.length === 0 ? (
            <div className="text-center py-16 animate-fade-up">
              <Grid3X3 className="w-12 h-12 text-[var(--secondary)] mx-auto mb-4 opacity-40" />
              <p className="text-[var(--secondary)] font-sans">No portfolios in the showcase yet. Be the first!</p>
              <Link href="/create" className="btn-primary mt-6">
                Create Your Portfolio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcasePortfolios.slice(0, 9).map((portfolio, i) => (
                <div key={portfolio.id} style={{ animationDelay: `${i * 0.08}s` }} className="animate-fade-up">
                  <ShowcaseCard portfolio={portfolio} />
                </div>
              ))}
            </div>
          )}

          {showcasePortfolios.length > 9 && (
            <div className="text-center mt-8">
              <p className="text-sm text-[var(--secondary)] font-sans">
                Showing 9 of {showcasePortfolios.length} portfolios
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 md:py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] to-[#F5F0E8]" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#C8963E]/5 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8963E]/8 text-[#C8963E] text-sm font-sans font-medium mb-6 animate-fade-up">
            <Sparkle className="w-4 h-4" />
            Limited only by your imagination
          </div>
          <h3 className="font-display text-4xl md:text-5xl lg:text-6xl italic text-[var(--foreground)] mb-5 animate-fade-up animate-stagger-1 leading-tight">
            Ready to stand out?
          </h3>
          <p className="text-[var(--secondary)] mb-10 font-sans text-base md:text-lg max-w-md mx-auto leading-relaxed animate-fade-up animate-stagger-2">
            Create your portfolio in under 2 minutes. It&apos;s free, fast, and genuinely impressive.
          </p>
          <Link href="/create" className="btn-primary text-lg px-10 py-4 shadow-glow animate-fade-up animate-stagger-3">
            <Sparkle className="w-5 h-5" />
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>
    </main>
  );
}
