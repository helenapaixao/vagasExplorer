import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CountUp from './CountUp';
import JobTicker from './JobTicker';
import type { Job } from '../../types/job';

interface HeroProps {
  total: number | null;
  jobs: Job[];
}

/**
 * The entrance is a CSS animation, not a JS one. Hero copy that starts at
 * opacity 0 and waits for a frame loop is a blank page for anyone without
 * JavaScript — and this page is server-rendered precisely so it isn't.
 *
 * One staggered sequence, top to bottom, then the stream fades in last.
 */
const enter =
  'animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both';

const Hero: React.FC<HeroProps> = ({ total, jobs }) => (
  <section className="relative">
    {/* Atmosphere only: a single low glow in the brand hue, behind everything. */}
    <div
      aria-hidden
      className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]"
    />

    <div className="grid items-center gap-10 py-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14 lg:py-16">
      <div>
        <p
          className={`${enter} flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground`}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          {total !== null ? (
            <>
              <CountUp value={total} /> vagas abertas agora
            </>
          ) : (
            'vagas das comunidades brasileiras'
          )}
        </p>

        <h1
          className={`${enter} delay-100 mt-5 font-display text-[2.25rem] font-semibold leading-[1.06] tracking-tight sm:text-5xl`}
        >
          As vagas moram em
          <br />
          <span className="text-primary">issues do GitHub.</span>
          <br />
          Aqui você busca todas.
        </h1>

        <p
          className={`${enter} delay-200 mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground`}
        >
          backend-br, frontendbr, React Brasil, QA Brasil e mais quatro
          comunidades — em um só campo de busca. Filtre por stack, nível e
          regime, e candidate-se direto no GitHub.
        </p>

        <div className={`${enter} delay-300 mt-8 flex flex-wrap gap-3`}>
          <Button asChild size="lg">
            <Link href="/vagas" className="no-underline">
              Buscar vagas
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/dashboard" className="no-underline">
              Ver por comunidade
            </Link>
          </Button>
        </div>
      </div>

      <div className={`${enter} delay-500 duration-700`}>
        <JobTicker jobs={jobs} />
      </div>
    </div>
  </section>
);

export default Hero;
