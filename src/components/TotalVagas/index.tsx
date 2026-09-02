import React, { useEffect, useState } from 'react';
import {
  animate,
  useMotionValue,
  useTransform,
  useReducedMotion,
  motion,
} from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import api from '../../services/api';

const COUNT_DURATION_SECONDS = 1.4;

const TotalVagas = () => {
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const reduceMotion = useReducedMotion();

  const count = useMotionValue(0);
  const display = useTransform(count, value =>
    Math.round(value).toLocaleString('pt-BR'),
  );

  useEffect(() => {
    api
      .get<{ total: number }>('/api/vagas-total')
      .then(({ data }) => setTotal(data.total))
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    if (total === null) return undefined;

    // Quem pediu menos movimento recebe o número final direto, sem contagem.
    if (reduceMotion) {
      count.set(total);
      return undefined;
    }

    const controls = animate(count, total, {
      duration: COUNT_DURATION_SECONDS,
      ease: 'easeOut',
    });

    return () => controls.stop();
  }, [total, count, reduceMotion]);

  // O número é complemento da chamada: se a rota falhar, a home segue sem ele.
  if (error) return null;

  if (total === null) {
    return (
      <div className="py-2">
        <Skeleton className="h-12 w-40" />
      </div>
    );
  }

  return (
    <div className="py-2">
      <p className="flex items-baseline gap-2 flex-wrap">
        <motion.span
          className="text-5xl font-bold leading-none text-primary"
          // O leitor de tela recebe o valor final de uma vez; a contagem é
          // enfeite visual e anunciá-la a cada quadro seria ruído.
          aria-hidden="true"
        >
          {display}
        </motion.span>
        <span className="sr-only">{total.toLocaleString('pt-BR')}</span>
        <span className="text-lg text-muted-foreground">vagas abertas</span>
      </p>
    </div>
  );
};

export default TotalVagas;
