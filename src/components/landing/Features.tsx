import React from 'react';
import { Bookmark, ListFilter, Timer } from 'lucide-react';
import { useInView } from '../../hooks/useInView';

/**
 * Three things the GitHub issue list itself can't do — which is the whole
 * reason this site exists. Stated as the reader's problem, not as features.
 */
const FEATURES = [
  {
    icon: ListFilter,
    title: 'Uma busca, oito repositórios',
    text: 'Procurar "react pleno remoto" no GitHub significa abrir oito abas. Aqui é um campo só, com filtros de stack, nível, regime e contrato.',
  },
  {
    icon: Timer,
    title: 'Você vê a idade da vaga',
    text: 'Issue aberta não quer dizer vaga aberta. Tudo vem da mais recente para a mais antiga, e o que passa de três meses avisa antes de você perder tempo.',
  },
  {
    icon: Bookmark,
    title: 'Guarde para depois',
    text: 'Salve as vagas que interessam e volte quando o currículo estiver pronto. Fica no seu navegador — sem cadastro, sem login.',
  },
];

const Features: React.FC = () => {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section ref={ref} className="border-t py-12">
      <ul className="grid list-none grid-cols-1 gap-x-10 gap-y-8 p-0 md:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <li
            key={feature.title}
            className={
              inView
                ? 'animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both'
                : undefined
            }
            style={inView ? { animationDelay: `${index * 110}ms` } : undefined}
          >
            <feature.icon className="h-5 w-5 text-primary" aria-hidden />
            <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {feature.text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Features;
