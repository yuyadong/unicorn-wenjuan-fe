import React, { type JSX } from 'react';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

type PropsType = {
  children: JSX.Element | JSX.Element[];
  items: Array<{ id: string; [key: string]: any }>;
  onDragEnd: (oldIndex: number, newIndex: number) => void;
};

const SortableContainer: React.FC<PropsType> = (props: PropsType) => {
  const { children, items, onDragEnd } = props;

  const sencors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over === null) return;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(c => c.fe_id === active.id);
      const newIndex = items.findIndex(c => c.fe_id === over.id);

      onDragEnd(oldIndex, newIndex);
    }
  }

  return (
    <DndContext sensors={sencors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};

export default SortableContainer;
