import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { GitHubRepo } from '../../types/github';

interface RepositoryInfoProps {
  repository: GitHubRepo;
}

const RepositoryInfo: React.FC<RepositoryInfoProps> = ({ repository }) => (
  <header className="flex flex-wrap items-center gap-5">
    <Avatar className="h-20 w-20 shrink-0">
      <AvatarImage src={repository.owner.avatar_url} alt="" />
      <AvatarFallback>
        {repository.owner.login.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
    <div className="min-w-0">
      <h1 className="text-2xl font-bold tracking-tight">
        {repository.full_name}
      </h1>
      {repository.description && (
        <p className="mt-1 max-w-prose text-muted-foreground">
          {repository.description}
        </p>
      )}
    </div>
  </header>
);

export default RepositoryInfo;
