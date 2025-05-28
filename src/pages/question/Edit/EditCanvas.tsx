import React from 'react';
import styles from './EditCanvas.module.scss';
import SpinLoading from '@/components/SpinLoading';
import useGetComponentInfo from '@/hooks/useGetComponentInfo';
import { getComponentConfByType } from '@/components/QuestionComponents';
import { type ComponentInfoType, changeSelectedId, moveComponent } from '@/store/componentsReducer';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';
import useBindCanvasKeyPress from '@/hooks/useBindCanvasKeyPress';
import SortableContainer from '@/components/DragSortable/SortableContainer';
import SortableItem from '@/components/DragSortable/SortableItem';

type PropsType = {
  loading: boolean;
};

function genComponent(componentInfo: ComponentInfoType) {
  const { type, props } = componentInfo;
  const componentConf = getComponentConfByType(type)!;
  if (componentConf === null) return null;
  const { Component } = componentConf;
  return <Component {...props} />;
}

const EditCanvas: React.FC<PropsType> = ({ loading }) => {
  const dispatch = useDispatch();
  const { componentList, selectedId } = useGetComponentInfo();

  function handleClick(event: React.MouseEvent<HTMLDivElement>, id: string) {
    event.stopPropagation();
    dispatch(changeSelectedId(id));
  }

  useBindCanvasKeyPress();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <SpinLoading />
      </div>
    );
  }
  const componentListWithId = componentList.map(c => ({ ...c, id: c.fe_id }));

  function handleDragEnd(oldIndex: number, newIndex: number) {
    dispatch(moveComponent({ oldIndex, newIndex }));
  }

  return (
    <SortableContainer items={componentListWithId} onDragEnd={handleDragEnd}>
      <div className={styles.canvas}>
        {componentList
          .filter(c => !c.isHidden)
          .map(c => {
            const { fe_id, isLocked } = c;

            const defaultClassName = styles['component-wrapper'];
            const selectedClassName = styles.selected;
            const lockedClassName = styles.locked;
            const wrapperClassName = classnames({
              [defaultClassName]: true,
              [selectedClassName]: fe_id === selectedId,
              [lockedClassName]: isLocked,
            });

            return (
              <SortableItem key={fe_id} id={fe_id}>
                <div className={wrapperClassName} onClick={e => handleClick(e, fe_id)}>
                  <div className={styles.component}>{genComponent(c)}</div>
                </div>
              </SortableItem>
            );
          })}
      </div>
    </SortableContainer>
  );
};

export default EditCanvas;
