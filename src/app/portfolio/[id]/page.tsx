'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { THEMES, Theme } from '@/lib/themes';
import { Job } from '@/lib/types';
import { 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  RefreshCw,
  Trash2,
  Check,
  Loader2,
  Sparkles,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

function LinkedinIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; bg: string }> = {
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
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ color: c.color, backgroundColor: c.bg }}
    >
      {status === 'SCRAPING' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {status === 'DONE' && <Check className="w-3.5 h-3.5" />}
      {status === 'FAILED' && <AlertCircle className="w-3.5 h-3.5" />}
      {!['SCRAPING', 'DONE', 'FAILED'].includes(status) && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {c.label}
    </span>
  );
}

function ThemeCard({ 
  theme, 
  selected, 
  onClick 
}: { 
  theme: Theme; 
  selected: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`theme-card w-full text-left p-0 ${selected ? 'selected' : ''}`}
      type="button"
    >
      <div 
        className="h-20 w-full relative overflow-hidden rounded-t-2xl"
        style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primary}dd 100%)` }}
      >
        <div className="absolute inset-0 p-3 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white/20" />
            <div className="h-1.5 w-16 rounded bg-white/40" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-3/4 rounded bg-white/30" />
            <div className="h-1.5 w-1/2 rounded bg-white/20" />
          </div>
        </div>
      </div>
      <div className="p-2 bg-white rounded-b-2xl">
        <p className="font-semibold text-xs text-[var(--text-primary)]">{theme.name}</p>
      </div>
    </button>
  );
}

export default function PortfolioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [isUpdatingTheme, setIsUpdatingTheme] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userUuid, setUserUuid] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ilovelinkedin_user_uuid');
    if (stored) setUserUuid(stored);
  }, []);

  const fetchJob = useCallback(async () => {
    if (!userUuid || !id) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        headers: { 'x-user-uuid': userUuid },
      });
      if (res.ok) {
        const data = await res.json();
        setJob(data.job);
        setSelectedTheme(data.job.theme);
      }
    } catch (err) {
      console.error('Failed to fetch job:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id, userUuid]);

  useEffect(() => {
    if (userUuid) fetchJob();
  }, [userUuid, fetchJob]);

  // Poll for updates if not in terminal state
  useEffect(() => {
    if (!job) return;
    if (job.status === 'DONE' || job.status === 'FAILED') return;

    const interval = setInterval(fetchJob, 5000);
    return () => clearInterval(interval);
  }, [job, fetchJob]);

  const handleThemeChange = async (themeId: string) => {
    setSelectedTheme(themeId);
    setShowThemeDropdown(false);
    setIsUpdatingTheme(true);

    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-uuid': userUuid,
        },
        body: JSON.stringify({ theme: themeId }),
      });

      if (res.ok) {
        const data = await res.json();
        setJob(data.job);
      }
    } catch (err) {
      console.error('Failed to update theme:', err);
    } finally {
      setIsUpdatingTheme(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-uuid': userUuid },
      });

      if (res.ok) {
        router.push('/');
      } else {
        setError('Failed to delete portfolio');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCopy = async () => {
    if (job?.deployedUrl) {
      await navigator.clipboard.writeText(job.deployedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const theme = THEMES.find(t => t.id === job?.theme);
  const currentTheme = THEMES.find(t => t.id === selectedTheme);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-[var(--error)]" />
        <h1 className="font-serif text-2xl">Portfolio not found</h1>
        <a href="/" className="btn-primary">Back to Home</a>
      </main>
    );
  }

  const scrapedData = job.scrapedData as Record<string, unknown> | null;
  const name = scrapedData?.name as string | null;
  const headline = scrapedData?.headline as string | null;
  const location = scrapedData?.location as string | null;
  const skills = (scrapedData?.skills as string[] | null) || [];
  const experience = scrapedData?.experience as Array<{title?: string; company?: string; duration?: string}> | null;
  const education = scrapedData?.education as Array<{school?: string; degree?: string; year?: string}> | null;

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back
            </a>
            <div className="w-px h-4 bg-[var(--border)]" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
                <LinkedinIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-lg">Portfolio</span>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Hero Card */}
        <div 
          className="rounded-3xl p-8 mb-8 animate-fade-up"
          style={{ 
            background: `linear-gradient(145deg, ${theme?.colors.primary || '#1C1C1E'} 0%, ${theme?.colors.primary || '#1C1C1E'}dd 100%)`
          }}
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <LinkedinIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                {name ? (
                  <h1 className="font-serif text-3xl text-white mb-1">{name}</h1>
                ) : (
                  <p className="text-white/60 font-mono text-sm">{job.linkedinUrl}</p>
                )}
                {headline && <p className="text-white/70 text-lg">{headline}</p>}
                {location && (
                  <p className="text-white/50 text-sm mt-1 flex items-center gap-1">📍 {location}</p>
                )}
              </div>
            </div>
          </div>

          {job.status === 'DONE' && job.deployedUrl && (
            <div className="flex items-center gap-3">
              <a 
                href={job.deployedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[var(--text-primary)] font-semibold hover:bg-white/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Portfolio
              </a>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          )}

          {(job.status === 'SCRAPING' || job.status === 'BUILDING' || job.status === 'DEPLOYING') && (
            <div className="flex items-center gap-2 text-white/70">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Building your portfolio...</span>
            </div>
          )}

          {job.status === 'FAILED' && job.errorMessage && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-white/10 text-white/90 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {job.errorMessage}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {/* Theme selector */}
          <div className="relative">
            <button
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
              disabled={job.status === 'FAILED'}
              className="btn-secondary !py-2 !px-4 flex items-center gap-2"
            >
              {isUpdatingTheme ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span className="text-sm">{currentTheme?.name || 'Theme'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showThemeDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showThemeDropdown && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border border-[var(--border)] shadow-lg p-3 z-50">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-3 px-2">
                  Change Theme
                </p>
                <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                  {THEMES.map(t => (
                    <ThemeCard
                      key={t.id}
                      theme={t}
                      selected={selectedTheme === t.id}
                      onClick={() => handleThemeChange(t.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchJob}
            className="btn-secondary !py-2 !px-4"
            disabled={job.status === 'DONE' || job.status === 'FAILED'}
          >
            <RefreshCw className={`w-4 h-4 ${job.status !== 'DONE' && job.status !== 'FAILED' ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>

          {/* Delete */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>

        {/* Scraped Data */}
        {scrapedData && Object.keys(scrapedData).length > 0 && (
          <div className="space-y-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {skills.length > 0 && (
              <div className="card-surface p-6">
                <h3 className="font-serif text-xl mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string, i: number) => (
                    <span 
                      key={i}
                      className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: `${theme?.colors.primary}15` || '#f0f0f0',
                        color: theme?.colors.primary || '#666',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {experience && experience.length > 0 && (
              <div className="card-surface p-6">
                <h3 className="font-serif text-xl mb-4">Experience</h3>
                <div className="space-y-4">
                  {experience.map((exp: {title?: string; company?: string; duration?: string}, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg)]">
                        <BriefcaseIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">{exp.title || 'Position'}</p>
                        <p className="text-sm text-[var(--text-secondary)]">{exp.company}</p>
                        {exp.duration && <p className="text-xs text-[var(--text-secondary)] mt-1">{exp.duration}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education && education.length > 0 && (
              <div className="card-surface p-6">
                <h3 className="font-serif text-xl mb-4">Education</h3>
                <div className="space-y-4">
                  {education.map((edu: {school?: string; degree?: string; year?: string}, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg)]">
                        <GraduationIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">{edu.school || 'School'}</p>
                        <p className="text-sm text-[var(--text-secondary)]">{edu.degree}</p>
                        {edu.year && <p className="text-xs text-[var(--text-secondary)] mt-1">{edu.year}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--error)]/10 text-[var(--error)] text-sm mt-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-fade-up" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-[var(--error)]/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-[var(--error)]" />
            </div>
            <h3 className="font-serif text-2xl text-center mb-2">Delete Portfolio?</h3>
            <p className="text-[var(--text-secondary)] text-center mb-6">
              This will permanently delete this portfolio. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-white bg-[var(--error)] hover:bg-[var(--error)]/90 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function BriefcaseIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  );
}

function GraduationIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
    </svg>
  );
}
