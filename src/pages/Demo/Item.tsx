import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

type PropsType = {
  id: string;
  title: string;
};

const Item: React.FC<PropsType> = (props: PropsType) => {
  const { id, title } = props;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid red',
    backgroundColor: '#f1f1f1',
    margin: '12px 0',
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id} {title}
    </div>
  );
};

export default Item;
