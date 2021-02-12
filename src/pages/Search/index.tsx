
import React, { useState, FormEvent } from "react";
import {Container,Content,Error,Form} from './styles'
/* import { getResults } from "../../services/client"; */

/* import { Section } from "../../styles/shared"; */
/* import { Container, Content, Form, Error } from "./styles"; */

import Header from "../../components/Header";
/* import MediaCarousel from "../../components/Moviecarousel"; */

import Button from "../../components/Button";
import SearchInput from "../../components/SearchInput";
import api from '../../services/api'

export interface IResult {
  full_name: string;
  description: string;
  stargazers_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };

}






const Search: React.FC = () => {
    const [query, setQuery] = useState("");
    const [inputError, setInputError] = useState("");
    const [result, setResult] = useState<IResult[]>([]);
    const [lastQuery, setLastQuery] = useState("");

    async function handleSearch(
        event: FormEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        if (!query) {
            setInputError("Para continuar você precisa buscar algo!! :)");
            return;
        }

        try {
            const searchResult = await api.get(`search/multi?query=${query}`);
            setResult(searchResult);

            setLastQuery(query);
            setQuery("");
            setInputError("");

            if (searchResult.length === 0) {
                setInputError(`No results found for ${query}`);
            }
        } catch (err) {
            setInputError("Ops, something bad happend.");
        }
    }

    return (
        <>
            <Container>
                <Header />
                <Content>
                    <Form onSubmit={handleSearch}>
                        <SearchInput
                            name="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Busque algum filme(genêro,ano)"
                        />

                        <Button type="submit">Buscar Filme</Button>


                    </Form>
                </Content>

                {inputError && <Error>{inputError}</Error>}

                {result.length > 0 && (

                        <h1>Resultados para: {lastQuery}</h1>


                )}
            </Container>
        </>
    );
};

export default Search;
