import React, { useState, type ChangeEvent } from 'react';
import useGetComponentInfo from '@/hooks/useGetComponentInfo';
import styles from './Layers.module.scss';
import classNames from 'classnames';
import { Button, Input, message, Space } from 'antd';
import { useDispatch } from 'react-redux';
import {
  changeSelectedId,
  changeComponentTitle,
  toggleComponentLocked,
  changeComponentHidden,
  moveComponent,
} from '@/store/componentsReducer';
import { EyeInvisibleOutlined, LockOutlined } from '@ant-design/icons';
import SortableContainer from '@/components/DragSortable/SortableContainer';
import SortableItem from '@/components/DragSortable/SortableItem';

const Layers: React.FC = () => {
  const dispatch = useDispatch();
  const { componentList, selectedId } = useGetComponentInfo();
  const [changingTitleId, setChangingTitleId] = useState('');

  function handleTitleClick(fe_id: string) {
    const curComp = componentList.find(c => c, fe_id === fe_id);
    if (curComp && curComp.isHidden) {
      message.info('不能选中隐藏的组件');
      return;
    }
    if (fe_id !== selectedId) {
      dispatch(changeSelectedId(fe_id));
      setChangingTitleId('');
      return;
    }
    setChangingTitleId(fe_id);
  }

  function changeTitle(event: ChangeEvent<HTMLInputElement>) {
    const newTitle = event.target.value.trim();
    if (!newTitle) return;
    if (!selectedId) return;
    dispatch(changeComponentTitle({ fe_id: selectedId, title: newTitle }));
  }

  function changeHidden(fe_id: string, isHidden: boolean) {
    dispatch(changeComponentHidden({ fe_id, isHidden }));
  }

  function changeLocked(fe_id: string) {
    dispatch(toggleComponentLocked({ fe_id }));
  }

  const componentListWithId = componentList.map(c => ({ ...c, id: c.fe_id }));

  function handleDragEnd(oldIndex: number, newIndex: number) {
    dispatch(moveComponent({ oldIndex, newIndex }));
  }

  return (
    <SortableContainer items={componentListWithId} onDragEnd={handleDragEnd}>
      {componentListWithId.map(c => {
        const { fe_id, title, isHidden, isLocked } = c;

        const titleDefaultClassName = styles.title;
        const selectedClassName = styles.selected;
        const titleClassName = classNames({
          [titleDefaultClassName]: true,
          [selectedClassName]: fe_id === selectedId,
        });

        return (
          <SortableItem key={fe_id} id={fe_id}>
            <div className={styles.wrapper}>
              <div className={titleClassName} onClick={() => handleTitleClick(fe_id)}>
                {fe_id === changingTitleId && (
                  <Input
                    value={title}
                    onBlur={() => setChangingTitleId('')}
                    onPressEnter={() => setChangingTitleId('')}
                    onChange={changeTitle}
                  />
                )}
                {fe_id !== changingTitleId && title}
              </div>
              <div className={styles.handler}>
                <Space>
                  <Button
                    size="small"
                    shape="circle"
                    className={!isHidden ? styles.btn : ''}
                    icon={<EyeInvisibleOutlined />}
                    type={isHidden ? 'primary' : 'text'}
                    onClick={() => changeHidden(fe_id, !isHidden)}
                  />
                  <Button
                    size="small"
                    shape="circle"
                    className={!isLocked ? styles.btn : ''}
                    icon={<LockOutlined />}
                    type={isLocked ? 'primary' : 'text'}
                    onClick={() => changeLocked(fe_id)}
                  />
                </Space>
              </div>
            </div>
          </SortableItem>
        );
      })}
    </SortableContainer>
  );
};

export default Layers;
