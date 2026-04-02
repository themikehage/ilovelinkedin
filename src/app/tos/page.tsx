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
          Términos del Servicio
        </h1>
        <p className="text-sm text-[var(--secondary)] font-sans mb-12">Última actualización: abril 2026</p>

        <div className="space-y-8">
          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              1. Acerca del servicio
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed">
              ilovelinkedin es una herramienta independiente que permite generar una página de portfolio
              personal a partir de información públicamente disponible en perfiles de LinkedIn. El servicio
              está diseñado únicamente para que cada usuario cree un portfolio de su propio perfil de LinkedIn.
            </p>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed mt-3">
              <strong className="font-semibold">ilovelinkedin no está afiliado, avalado ni patrocinado por LinkedIn Corporation
              ni LinkedIn Ireland.</strong> LinkedIn es marca registrada de LinkedIn Corporation.
            </p>
          </section>

          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              2. Uso del servicio
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed mb-4">
              Al utilizar ilovelinkedin, declarás y garantizás que:
            </p>
            <ul className="space-y-2">
              {[
                'La URL de LinkedIn que proporcionás corresponde a tu propio perfil.',
                'Contás con el derecho de generar un portfolio con la información de tu perfil.',
                'No utilizarás el servicio para crear portfolios de perfiles ajenos sin su autorización.',
                'Cumplís con todas las leyes aplicables de privacidad y protección de datos.',
                'Tenés 16 años o más (edad mínima requerida por LinkedIn).',
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
              3. Contenido del portfolio
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed">
              El contenido del portfolio se obtiene de información públicamente disponible en tu perfil de LinkedIn.
              ilovelinkedin no verifica la exactitud, integridad ni actualidad de dichos datos. El contenido
              publicado en el portfolio es responsabilidad exclusiva del usuario que lo generó.
            </p>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed mt-3">
              Si detectás que tu información aparece en un portfolio que no autorizaste, podés solicitar su retirada
              escribiendo a <a href="mailto:contacto@therry.dev" className="underline hover:text-[#C8963E]">contacto@therry.dev</a>.
            </p>
          </section>

          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              4. Prohibiciones
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed mb-4">
              Queda prohibido utilizar ilovelinkedin para:
            </p>
            <ul className="space-y-2">
              {[
                'Crear portfolios de perfiles de terceros sin su autorización expresa.',
                'Generar contenido falso, engañoso o que infrinja derechos de terceros.',
                'Utilizar el servicio para cualquier propósito ilegal.',
                'Reproducir o distribuir contenido de LinkedIn en violación de sus Términos de Servicio.',
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
              5. Indemnización
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed">
              El usuario se compromete a indemnizar y mantener indemne a ilovelinkedin, sus creadores y afiliados,
              de cualquier reclamo, demanda, daño o gasto (incluyendo honorarios legales) que surja de su uso del
              servicio o de la violación de estos términos.
            </p>
          </section>

          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              6. Sin garantías
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed">
              EL SERVICIO SE PROVEE &quot;TAL COMO ESTÁ&quot; SIN GARANTÍAS DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS,
              INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIABILIDAD, IDONEIDAD PARA UN PROPÓSITO PARTICULAR
              Y NO INFRACCIÓN. No garantizamos que el servicio sea ininterrumpido, seguro o libre de errores.
            </p>
          </section>

          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              7. Limitación de responsabilidad
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed">
              EN NINGÚN CASO ilovelinkedin SERÁ RESPONSABLE POR DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES,
              EJEMPLARES O CONSECUENTES (INCLUYENDO PÉRDIDA DE DATOS, LUCRO CESANTE U OTROS) QUE SURJAN DE
              O ESTÉN RELACIONADOS CON EL USO O LA INCAPACIDAD DE USAR EL SERVICIO.
            </p>
          </section>

          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              8. Tus derechos — Solicitudes de retirada
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed">
              Si sos el titular de un perfil de LinkedIn y tu información aparece en un portfolio generado por
              este servicio sin tu autorización, tenés derecho a solicitar su retirada inmediata.
            </p>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed mt-3">
              Envianos un email a{' '}
              <a href="mailto:contacto@therry.dev" className="underline hover:text-[#C8963E]">
                contacto@therry.dev
              </a>{' '}
              indicando la URL del portfolio y tu perfil de LinkedIn. Procesaremos tu solicitud a la brevedad.
            </p>
          </section>

          <section className="card-surface p-8">
            <h2 className="font-display text-xl font-semibold italic text-[var(--foreground)] mb-4">
              9. Modificaciones
            </h2>
            <p className="text-sm text-[var(--secondary)] font-sans leading-relaxed">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios sustanciales
              serán comunicados mediante un aviso prominent en el sitio. El uso continuado del servicio tras la
              publicación de cambios constituye aceptación de los nuevos términos.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-[var(--secondary)] font-sans">
            ¿Preguntas? <a href="mailto:contacto@therry.dev" className="underline hover:text-[#C8963E]">contacto@therry.dev</a>
          </p>
        </div>
      </div>
    </main>
  );
}
