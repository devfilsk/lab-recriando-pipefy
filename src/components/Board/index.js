import React from 'react';
import { loadLists } from '../../services/api' 

import { Container } from './styles';
import List from '../List'

// passar para dentro do component e fazer requisição para a API
const lists = loadLists();

export default function Board() {
  return (
    <Container >
      {lists.map(list => <List key={list.title} data={list} />)}
    </Container>
  );
}
