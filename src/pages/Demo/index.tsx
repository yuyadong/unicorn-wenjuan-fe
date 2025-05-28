import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import Item from './Item';

type ComponentType = {
  fe_id: string;
  title: string;
};

const Demo: React.FC = () => {
  const [items, setItems] = useState<ComponentType[]>([
    {
      fe_id: 'c1',
      title: '组件1',
    },
    {
      fe_id: 'c2',
      title: '组件2',
    },
    {
      fe_id: 'c3',
      title: '组件3',
    },
  ]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over === null) return;

    if (active.id !== over.id) {
      setItems(items => {
        const oldIndex = items.findIndex(c => c.fe_id === active.id);
        const newIndex = items.findIndex(c => c.fe_id === over.id);
        console.log(oldIndex, newIndex);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const sencors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  return (
    <DndContext sensors={sencors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map(({ fe_id, title }) => (
          <Item key={fe_id} id={fe_id} title={title} />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default Demo;
