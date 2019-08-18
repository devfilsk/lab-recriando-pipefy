import React, { useRef, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import BoardContext from '../Board/context';

import { Container, Label } from './styles';

export default function Card({ data, index, listIndex }) {

  const ref = useRef();
  const { move } = useContext(BoardContext)

  const [{ isDragging }, dragRef] =  useDrag({
    item: { type: 'CARD', index, listIndex },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor){
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;

      const draggedIndex = item.index;
      const targetIndex = index;

      if(draggedIndex === targetIndex && draggedListIndex === targetListIndex){
        return;
      }

      // pega a posição e as características do elemento de drop
      const targetSize = ref.current.getBoundingClientRect();
      // pegar centro do elemento target
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;

      const draggedOffset = monitor.getClientOffset();
      // Pega o quanto um elemento foi arrastado dentro de um card
      const draggedTop = draggedOffset.y - targetSize.top;

      // se o item arrastado ja for naturalmente de antes do card alvo e o card for arrastado para a posição atual, não fazer nada.  
      if(draggedIndex < targetIndex && draggedTop < targetCenter){
        return;
      }

       // se o item arrastado ja for naturalmente de depois do card alvo e o card for arrastado para a posição atual, não fazer nada.  
      if(draggedIndex > targetIndex && draggedTop > targetCenter){
        return;
      }

      // passar a movimentação para o contexto global, seguindo os parametros from, to, da função dentro do contexto.
      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);

      // para evitar o bug ao arrastar, alterar o index do item arrastado 
      item.index = targetIndex;
      // alterar o list para a lista arrastada, sendo a mesma ou outra lista
      item.listIndex =  targetListIndex;
    }
  });

  dragRef(dropRef(ref));

  return (
    <Container ref={ref} isDragging={isDragging}>
      <header>
        {data.labels.map(label => <Label key={label} color={label} />)}
      </header>
      <p>{data.content}</p>
      {data.user && <img src={data.user} alt="" />}
    </Container>
  );
}
