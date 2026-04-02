'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { THEMES, Theme } from '@/lib/themes';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

function LinkedinIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
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
        className="h-28 w-full relative overflow-hidden rounded-t-2xl"
        style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primary}dd 100%)` }}
      >
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm" />
            <div className="h-2 w-20 rounded bg-white/40" />
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-3/4 rounded bg-white/30" />
            <div className="h-2 w-1/2 rounded bg-white/20" />
            <div className="flex gap-1 mt-2">
              <div className="h-5 w-16 rounded-full bg-white/20" />
              <div className="h-5 w-12 rounded-full bg-white/15" />
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-0 right-0 w-16 h-16 rounded-tl-full opacity-20"
          style={{ background: theme.colors.accent }}
        />
      </div>
      <div className="p-3 bg-white rounded-b-2xl">
        <p className="font-display font-semibold text-sm text-[var(--foreground)]">{theme.name}</p>
        <p className="text-xs text-[var(--secondary)] mt-0.5 font-sans">{theme.description}</p>
      </div>
    </button>
  );
}

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0].id);
  const [urlValid, setUrlValid] = useState<boolean | null>(null);
  const [vibeFilter, setVibeFilter] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userUuid, setUserUuid] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    setUserUuid(getOrCreateUserUuid());
  }, []);

  const vibes = [
    { id: null, label: 'All' },
    { id: 'dark', label: '🌑 Dark' },
    { id: 'minimal', label: '◻️ Minimal' },
    { id: 'colorful', label: '🌈 Colorful' },
    { id: 'professional', label: '💼 Professional' },
    { id: 'nature', label: '🌿 Nature' },
    { id: 'retro', label: '📼 Retro' },
    { id: 'luxury', label: '✨ Luxury' },
    { id: 'urban', label: '🏙️ Urban' },
    { id: 'tech', label: '⚡ Tech' },
    { id: 'sport', label: '🏁 Sport' },
    { id: 'editorial', label: '📝 Editorial' },
  ];

  const filteredThemes = vibeFilter
    ? THEMES.filter(t => t.vibe === vibeFilter)
    : THEMES;

  const validateUrl = (url: string) => {
    const patterns = [
      /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
      /^https:\/\/linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
    ];
    return patterns.some((p) => p.test(url));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLinkedinUrl(val);
    if (val.length > 10) {
      setUrlValid(validateUrl(val));
    } else {
      setUrlValid(null);
    }
  };

  const handleNext = () => {
    if (!urlValid) {
      setError('Please enter a valid LinkedIn profile URL');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-uuid': userUuid,
        },
        body: JSON.stringify({
          linkedinUrl,
          theme: selectedTheme,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setIsSubmitting(false);
        return;
      }

      router.push('/');
    } catch {
      setError('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  const currentTheme = THEMES.find(t => t.id === selectedTheme);

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
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-sans text-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </a>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-[#E8E4DE] bg-white">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-semibold transition-all duration-500 ${
                step >= 1 ? 'bg-[#C8963E] text-white shadow-glow' : 'bg-[#E8E4DE] text-[var(--secondary)]'
              }`}>
                {step > 1 ? <Check className="w-5 h-5" /> : '01'}
              </div>
              <span className={`text-sm font-sans font-medium hidden sm:inline transition-colors ${
                step >= 1 ? 'text-[var(--foreground)]' : 'text-[var(--secondary)]'
              }`}>LinkedIn URL</span>
            </div>

            {/* Connector */}
            <div className="flex-1 h-0.5 rounded-full overflow-hidden bg-[#E8E4DE]">
              <div
                className="h-full bg-[#C8963E] rounded-full transition-all duration-700 ease-out"
                style={{ width: step === 1 ? '0%' : '100%' }}
              />
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-semibold transition-all duration-500 ${
                step >= 2 ? 'bg-[#C8963E] text-white shadow-glow' : 'bg-[#E8E4DE] text-[var(--secondary)]'
              }`}>
                02
              </div>
              <span className={`text-sm font-sans font-medium hidden sm:inline transition-colors ${
                step >= 2 ? 'text-[var(--foreground)]' : 'text-[var(--secondary)]'
              }`}>Choose Theme</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {step === 1 ? (
          /* STEP 1 */
          <div className="animate-fade-up">
            <div className="mb-2">
              <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#C8963E]">Step 01</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl italic text-[var(--foreground)] mb-4 leading-tight">
              Enter your LinkedIn URL
            </h1>
            <p className="text-[var(--secondary)] mb-10 font-sans text-base md:text-lg leading-relaxed max-w-xl">
              We'll retrieve your publicly available profile information and transform it into a stunning portfolio page.
            </p>

            <div className="mb-8">
              <label className="block section-label mb-3">LinkedIn Profile URL</label>
              <div className="relative">
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={handleUrlChange}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="input-field text-base py-4 pr-12"
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {urlValid === true && (
                    <div className="w-8 h-8 rounded-full bg-[#4A7C59]/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#4A7C59]" />
                    </div>
                  )}
                  {urlValid === false && (
                    <div className="w-8 h-8 rounded-full bg-[#C25450]/10 flex items-center justify-center">
                      <X className="w-4 h-4 text-[#C25450]" />
                    </div>
                  )}
                </div>
              </div>
              {urlValid === false && (
                <p className="text-xs text-[#C25450] mt-2 flex items-center gap-1.5 font-sans">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Please enter a valid LinkedIn profile URL
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-[#C25450]/8 text-[#C25450] text-sm font-sans mb-8">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={!urlValid}
              className="btn-primary text-base px-8 py-4 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          /* STEP 2 */
          <div className="animate-fade-up">
            <div className="mb-2">
              <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#C8963E]">Step 02</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl italic text-[var(--foreground)] mb-4 leading-tight">
              Pick a theme
            </h1>
            <p className="text-[var(--secondary)] mb-8 font-sans text-base md:text-lg leading-relaxed">
              Choose the visual style for your portfolio — you can change it later.
            </p>

            {/* Selected theme preview */}
            <div className="mb-8 p-5 rounded-2xl border border-[#E8E4DE] bg-white shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#4A7C59]/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#4A7C59]" />
                </div>
                <span className="text-sm font-sans font-medium text-[var(--secondary)]">Selected:</span>
                <span className="text-sm font-display font-semibold text-[#C8963E] italic text-base">
                  {currentTheme?.name}
                </span>
              </div>
              <div
                className="h-20 rounded-xl w-full"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme?.colors.primary} 0%, ${currentTheme?.colors.primary}dd 100%)`
                }}
              />
            </div>

            {/* Vibe filters */}
            <div className="flex flex-wrap gap-2 mb-5">
              {vibes.map(v => (
                <button
                  key={v.id || 'all'}
                  type="button"
                  onClick={() => setVibeFilter(v.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-sans font-semibold transition-all duration-200 ${
                    vibeFilter === v.id
                      ? 'bg-[#C8963E] text-white shadow-sm'
                      : 'bg-white text-[var(--secondary)] hover:text-[var(--foreground)] hover:bg-[#FAF8F5] border border-[#E8E4DE]'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-[var(--secondary)] mb-5 font-sans">
              {filteredThemes.length} theme{filteredThemes.length !== 1 ? 's' : ''}
            </p>

            {/* Theme grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 max-h-[420px] overflow-y-auto pr-2">
              {filteredThemes.map(theme => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  selected={selectedTheme === theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-[#C25450]/8 text-[#C25450] text-sm font-sans mb-8">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Consent gate */}
            <div className="mb-6 p-4 rounded-xl border border-[#E8E4DE] bg-white">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[#E8E4DE] text-[#C8963E] focus:ring-[#C8963E] cursor-pointer flex-shrink-0"
                />
                <span className="text-xs text-[var(--secondary)] font-sans leading-relaxed">
                  Declaro que esta URL de LinkedIn es mi propio perfil y tengo derecho a generar un portfolio con esta información. Acepto los{' '}
                  <a href="/tos" target="_blank" className="underline hover:text-[#C8963E]">términos del servicio</a>.
                </span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !consentChecked}
                className="btn-primary flex-1 text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Portfolio
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
