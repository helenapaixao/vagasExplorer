import React from 'react';

import * as S from './styles';

interface IssueProps {
  html_url: string;
  number: number;
  title: string;
  user: {
    login: string;
  }
  labels: [{
    name: string;
    color?: string;
  }]
}

const Issue = ({
  html_url,
  number,
  title,
  user,
  labels
}: IssueProps) => {

  const insertHashToColor = (color: string) => `#${color}`;

  return (
    <S.Container href={html_url}>
      <S.Header>
        <S.IssueCode>#{number}</S.IssueCode>
        <S.LabelsContent>
          {labels.map(item => (
            <S.Label color={item.color && insertHashToColor(item.color)}>{item.name}</S.Label>
          ))}
        </S.LabelsContent>
      </S.Header>

      <S.IssueContent>
        <S.IssueTitle>{title}</S.IssueTitle>
      </S.IssueContent>

      <S.Author>{user.login}</S.Author>
    </S.Container>
  );
}

export default Issue;
