import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import Issue from '../../components/Issue';

import api from '../../services/api';

import * as S from './styles';

interface RepositoryProps {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues: number;
  owner: {
    avatar_url: string,
    login: string;
  },
}

interface RepositoryParams {
  reponame: string;
}

interface IssueProps {
  id: number;
  html_url: string;
  number: number;
  title: string;
  user: {
    login: string;
  }
  labels: [{
    name: string;
  }]

}

const Repository = () => {
  const [repository, setRepository] = useState<RepositoryProps | null>(null);
  const [issues, setIssues] = useState<IssueProps[]>([]);

  const {params} = useRouteMatch<RepositoryParams>();

  useEffect(() => {
    async function handleGetData(): Promise<void> {
      const repo = await fetch(`${api}/repos/${params.reponame}`)
      const repoData = await repo.json();

      const issues = await fetch(`${api}/repos/${params.reponame}/issues`)
      const issuesData = await issues.json();

      setRepository(repoData);
      setIssues(issuesData);
    }

    handleGetData();
  }, [params.reponame])

  return (
    <S.Container>
      <S.Content>
      {/*   {
          repository &&
          <ProfileRepositoryCard
            full_name={repository.full_name}
            description={repository.description}
            stargazers_count={repository.stargazers_count}
            forks_count={repository.forks_count}
            open_issues={repository.open_issues}
            owner={repository.owner}

          />
        } */}
        <S.IssuesContent>
          <strong>Issues</strong>

          {
            issues.length ? issues.map(item => (
              <Issue
                html_url={item.html_url}
                key={item.id}
                number={item.number}
                title={item.title}
                user={item.user}
                labels={item.labels}
              />
            )) : <strong>Nenhuma issue a ser listada</strong>
          }
        </S.IssuesContent>
      </S.Content>
    </S.Container>
  );
}

export default Repository;
