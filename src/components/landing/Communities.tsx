import React from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInView } from '../../hooks/useInView';
import { repos } from '../../lib/repos';

const Communities: React.FC = () => {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section ref={ref} className="border-t py-12">
      <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        As comunidades
      </h2>

      <ul className="mt-6 flex list-none flex-wrap gap-2 p-0">
        {repos.map((repo, index) => (
          <li
            key={repo.link}
            className={
              inView
                ? 'animate-in fade-in zoom-in-95 duration-400 fill-mode-both'
                : undefined
            }
            style={inView ? { animationDelay: `${index * 45}ms` } : undefined}
          >
            <Link
              href={repo.link}
              className="flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 no-underline transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={repo.imageUrl} alt="" />
                <AvatarFallback className="text-[10px]">
                  {repo.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-mono text-xs text-foreground">
                {repo.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Communities;
