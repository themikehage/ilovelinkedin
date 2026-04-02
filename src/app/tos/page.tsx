'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function LinkedinIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export default function TosPage() {
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

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl md:text-5xl italic text-[var(--foreground)] mb-2 leading-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-[var(--secondary)] font-sans mb-12">Last updated: April 2026</p>

        <div className="space-y-8">
          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              1. About the Service
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed">
              ilovelinkedin is an independent tool that generates a personal portfolio page from publicly
              available information on LinkedIn profiles. The service is intended solely for users to create
              a portfolio from their own LinkedIn profile.
            </p>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed mt-3">
              <strong className="font-semibold">ilovelinkedin is not affiliated with, endorsed by, or sponsored by
              LinkedIn Corporation or LinkedIn Ireland.</strong> LinkedIn is a registered trademark of LinkedIn Corporation.
            </p>
          </section>

          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              2. Acceptable Use
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed mb-4">
              By using ilovelinkedin, you represent and warrant that:
            </p>
            <ul className="space-y-2">
              {[
                'The LinkedIn URL you provide corresponds to your own profile.',
                'You have the right to generate a portfolio using your profile information.',
                'You will not use the service to create portfolios of third-party profiles without their authorization.',
                'You comply with all applicable privacy and data protection laws.',
                'You are 16 years of age or older (LinkedIn\'s minimum age requirement).',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--secondary)] font-sans">
                  <span className="text-[#C8963E] font-bold mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              3. Portfolio Content
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed">
              Portfolio content is sourced from publicly available information on your LinkedIn profile.
              ilovelinkedin does not verify the accuracy, completeness, or currency of such data. The content
              published in the portfolio is the sole responsibility of the user who generated it.
            </p>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed mt-3">
              If you find your information appearing on a portfolio you did not authorize, you may request
              its removal by contacting <a href="mailto:contacto@therry.dev" className="underline hover:text-[#C8963E]">contacto@therry.dev</a>.
            </p>
          </section>

          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              4. Prohibited Uses
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed mb-4">
              You may not use ilovelinkedin to:
            </p>
            <ul className="space-y-2">
              {[
                'Create portfolios of third-party profiles without their express authorization.',
                'Generate false, misleading, or infringing content.',
                'Use the service for any unlawful purpose.',
                'Reproduce or distribute LinkedIn content in violation of LinkedIn\'s Terms of Service.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--secondary)] font-sans">
                  <span className="text-[#C25450] font-bold mt-0.5">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              5. Indemnification
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed">
              You agree to indemnify and hold harmless ilovelinkedin, its creators and affiliates, from any
              claim, demand, damage, or expense (including legal fees) arising from your use of the service
              or your violation of these terms.
            </p>
          </section>

          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              6. Disclaimer of Warranties
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
              BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
              NON-INFRINGEMENT. We do not warrant that the service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed">
              IN NO EVENT SHALL ilovelinkedin BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
              CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF DATA, LOST PROFITS, OR OTHER) ARISING FROM OR RELATED
              TO YOUR USE OF OR INABILITY TO USE THE SERVICE.
            </p>
          </section>

          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              8. Your Rights — Removal Requests
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed">
              If you are a LinkedIn profile owner and your information appears in a portfolio generated by
              this service without your authorization, you have the right to request its immediate removal.
            </p>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed mt-3">
              Email us at{' '}
              <a href="mailto:contacto@therry.dev" className="underline hover:text-[#C8963E]">
                contacto@therry.dev
              </a>{' '}
              with the portfolio URL and your LinkedIn profile. We will process your request promptly.
            </p>
          </section>

          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              9. Changes to These Terms
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed">
              We reserve the right to modify these terms at any time. Substantial changes will be communicated
              via a notice on the site. Continued use of the service after changes are posted constitutes
              acceptance of the new terms.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-[var(--secondary)] font-sans">
            Questions? <a href="mailto:contacto@therry.dev" className="underline hover:text-[#C8963E]">contacto@therry.dev</a>
          </p>
        </div>
      </div>
    </main>
  );
}
