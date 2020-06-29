import React, { useState, FormEvent, useEffect } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../../services/api";

import logoImg from "../../assets/logo.svg";
import { Title, Form, Repositories, Error, Header } from "./styles";

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState("");
    const [inputError, setInputError] = useState("");
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem(
            "@GithubExplorer:repositories",
        );
        if (storagedRepositories) {
            return JSON.parse(storagedRepositories);
        } else {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(
            "@GithubExplorer:repositories",
            JSON.stringify(repositories),
        );
    }, [repositories]);

    async function handleAddRepository(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();
        if (!newRepo) {
            setInputError("Digite o autor/repositorio");
            return;
        }
        try {
            const response = await api.get<Repository>(`repos/${newRepo}`);

            const repository = response.data;

            setRepositories([...repositories, repository]);
            setNewRepo("");
            setInputError("");
        } catch (err) {
            setInputError("Erro na busca por esse repositório");
        }
    }
    return (
        <>
            <Header>
                <img src={logoImg} alt="logo" />
                <h1>vagasExplorer</h1>
            </Header>

            <Title>Principais repositórios de vagas</Title>

            {/* <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                    value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                    placeholder="Digite o nome do repositório"
                />
                <button>Pesquisar</button>
            </Form> */}

            {inputError && <Error>{inputError}</Error>}

            <Repositories>
                <Link key="backend-br/vagas" to="/repository/backend-br/vagas">
                    <img
                        src="https://avatars1.githubusercontent.com/u/30732658?v=4"
                        alt="backend-br"
                    />
                    <div>
                        <strong>backend-br</strong>
                        <p>Espaço para divulgação de vagas para backenders</p>
                    </div>
                    <FiChevronRight size={20} />
                </Link>

                <Link key="frontendbr/vagas" to="/repository/frontendbr/vagas">
                    <img
                        src="https://avatars1.githubusercontent.com/u/16963863?v=4"
                        alt="frontendbr"
                    />
                    <div>
                        <strong>frontendbr</strong>
                        <p>
                            Espaço para divulgação de vagas para front-enders.
                        </p>
                    </div>
                    <FiChevronRight size={20} />
                </Link>

                <Link key="vuejs-br/vagas" to="/repository/vuejs-br/vagas">
                    <img
                        src="https://avatars2.githubusercontent.com/u/13300590?v=4.githubusercontent.com/u/16963863?v=4"
                        alt="vuejs-br"
                    />
                    <div>
                        <strong>vuejs-br</strong>
                        <p>
                            Espaço para divulgação de vagas relacionadas com
                            Vue.js
                        </p>
                    </div>
                    <FiChevronRight size={20} />
                </Link>

                <Link
                    key="androiddevbr/vagas"
                    to="/repository/androiddevbr/vagas"
                >
                    <img
                        src="https://avatars1.githubusercontent.com/u/13825651?v=4"
                        alt="androiddevbr-br"
                    />
                    <div>
                        <strong>vuejs-br</strong>
                        <p>Mural de vagas para desenvolvedor Android.</p>
                    </div>
                    <FiChevronRight size={20} />
                </Link>

                <Link
                    key="androiddevbr/vagas"
                    to="/repository/androiddevbr/vagas"
                >
                    <img
                        src="https://avatars0.githubusercontent.com/u/59667653?v=4.githubusercontent.com/u/13825651?v=4"
                        alt="qa-brasil-br"
                    />
                    <div>
                        <strong>qa-brasil</strong>
                        <p>
                            Espaço para divulgação de vagas para Quality
                            Assurance 🚀
                        </p>
                    </div>
                    <FiChevronRight size={20} />
                </Link>
            </Repositories>
        </>
    );
};

export default Dashboard;
