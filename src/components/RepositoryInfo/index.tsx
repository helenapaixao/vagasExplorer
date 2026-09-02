import React from 'react';
import Image from 'next/image';
import type { GitHubRepo } from '../../types/github';

interface RepositoryInfoProps {
  repository: GitHubRepo;
}

const RepositoryInfo: React.FC<RepositoryInfoProps> = ({ repository }) => (
  <header className="flex flex-wrap items-center gap-6">
    <Image
      src={repository.owner.avatar_url}
      alt=""
      width={120}
      height={120}
      className="shrink-0 rounded-full object-cover"
      priority
    />
    <div className="min-w-0">
      <h1 className="text-2xl font-bold sm:text-3xl">{repository.full_name}</h1>
      {repository.description && (
        <p className="mt-1 text-muted-foreground">{repository.description}</p>
      )}
      <p className="mt-4">
        <strong className="text-2xl">{repository.open_issues_count}</strong>{' '}
        <span className="text-muted-foreground">vagas abertas</span>
      </p>
    </div>
  </header>
);

export default RepositoryInfo;
