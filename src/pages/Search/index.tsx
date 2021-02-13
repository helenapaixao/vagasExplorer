
import React, { useState, FormEvent } from "react";
import {Container,Content,Error,Form} from './styles'


import Header from "../../components/Header";

import Button from "../../components/Button";
import SearchInput from "../../components/SearchInput";
import api from '../../services/api'


interface IResult {
  total_count: string;
  incomplete_results:string;
  title: string;
  id: string;
  html_url: string;
  items: {
    title: string;
  }
}


const Search: React.FC = () => {
    const [query, setQuery] = useState("");
    const [inputError, setInputError] = useState("");
    const [result, setResult] =  useState<IResult[]>([]);
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
            const searchResult = await api.get(`search/issues?q=${query}`);
            setResult(searchResult.data);
           console.log(searchResult.data);

            setLastQuery(query);
            setQuery("");
            setInputError("");

        } catch (err) {
            setInputError("Ops, algo não está certo.");
        }
    }

    return (
        <>
            <Container>
                <Content>
                    <Form onSubmit={handleSearch}>
                        <SearchInput
                            name="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Busque"
                        />
                        <Button type="submit">Buscar</Button>
                    </Form>
                </Content>

             {result && (
                 <div >
               {/*   <strong>{result.items.title}</strong> */}
             {/*  <strong>{result.incomplete_results}</strong> */}
    {/*  <strong>{result.items.title}</strong> */}
                  </div>


             )}

            </Container>
        </>
    );
};

export default Search;
