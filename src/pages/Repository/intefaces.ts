export interface RepositoryProps {
  full_name: string;
  description: string;
  stargazers_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

 export interface IssueProps {
  title: string;
  id: string;
  body: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: labelsProps[];
}

export interface RepositoryParamsProps {
  repository: string;
}



export interface labelsProps {
  color: string;
  id: number;
  name: string;
}
