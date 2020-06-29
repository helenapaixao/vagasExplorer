import React, { useEffect, useState } from "react";
import { useRouteMatch, Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { Header, RepositoryInfo, Issues } from "./styles";
import logoImg from "../../assets/logo.svg";
import api from "../../services/api";

interface Issue {
    title: string;
    id: string;
    html_url: string;
    user: {
        login: string;
        avatar_url:string;
    };
}

interface Repository {
    full_name: string;
    description: string;
    stargazers_count: number;

    open_issues_count: number;
    owner: {
        login: string;
        avatar_url: string;
    };
}

interface RepositoryParams {
    repository: string;
}

const Repository: React.FC = () => {
    const [repository, setRepositories] = useState<Repository | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);

    const { params } = useRouteMatch<RepositoryParams>();

    useEffect(() => {
        api.get(`repos/${params.repository}`).then((response) => {
            setRepositories(response.data);
        });

        api.get(`repos/${params.repository}/issues`).then((response) => {
            setIssues(response.data);
        });
    }, [params.repository]);

    return (
        <>
            <Header>
                <img src={logoImg} alt="Github Explorer" />
                <Link to="/dashboard">
                    <FiChevronLeft size={16} />
                    Voltar
                </Link>
            </Header>
            {repository && (
                <RepositoryInfo>
                    <header>
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                    </header>
                    <ul>

                        <li>
                            <strong>{repository.open_issues_count}</strong>
                            <span>Vagas abertas</span>
                        </li>
                    </ul>
                </RepositoryInfo>
            )}

            <Issues>
                {issues.map((issue) => (
                    <a key={issue.id} href={issue.html_url}>
                               <img src={issue.user.avatar_url} alt={issue.user.login} />
                        <div>
                            <strong>{issue.title}</strong>
                            <p>{issue.user.login}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </a>
                ))}
            </Issues>
        </>
    );
};

export default Repository;
