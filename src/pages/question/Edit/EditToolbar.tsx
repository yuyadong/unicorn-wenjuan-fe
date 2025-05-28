import React from 'react';
import { Button, Space, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  CopyOutlined,
  BlockOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import {
  changeComponentHidden,
  copySelectedComponent,
  pasetCopiedComponent,
  removeSelectedComponent,
  toggleComponentLocked,
  moveComponent,
} from '@/store/componentsReducer';
import useGetComponentInfo from '@/hooks/useGetComponentInfo';
import { ActionCreators } from 'redux-undo';

const EditToolbar: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedId, componentList, selectedComponent, copiedComponent } = useGetComponentInfo();
  const { isLocked } = selectedComponent || {};
  const length = componentList.length;
  const selectedIndex = componentList.findIndex(c => c.fe_id === selectedId);
  const isFirst = selectedIndex <= 0;
  const isLast = selectedIndex + 1 >= length;

  function del() {
    dispatch(removeSelectedComponent());
  }

  function hidden() {
    dispatch(changeComponentHidden({ fe_id: selectedId, isHidden: true }));
  }

  function lock() {
    dispatch(toggleComponentLocked({ fe_id: selectedId }));
  }

  function copy() {
    dispatch(copySelectedComponent());
  }

  function paset() {
    dispatch(pasetCopiedComponent());
  }

  function moveUp() {
    if (isFirst) return;
    dispatch(
      moveComponent({
        oldIndex: selectedIndex,
        newIndex: selectedIndex - 1,
      }),
    );
  }

  function moveDown() {
    if (isLast) return;
    dispatch(
      moveComponent({
        oldIndex: selectedIndex,
        newIndex: selectedIndex + 1,
      }),
    );
  }

  function undo() {
    dispatch(ActionCreators.undo());
  }

  function redo() {
    dispatch(ActionCreators.redo());
  }

  return (
    <Space>
      <Tooltip title="删除">
        <Button shape="circle" icon={<DeleteOutlined />} onClick={del}></Button>
      </Tooltip>
      <Tooltip title="隐藏">
        <Button shape="circle" icon={<EyeInvisibleOutlined />} onClick={hidden}></Button>
      </Tooltip>
      <Tooltip title="锁定">
        <Button
          shape="circle"
          icon={<LockOutlined />}
          onClick={lock}
          type={(isLocked as boolean) ? 'primary' : 'default'}
        ></Button>
      </Tooltip>
      <Tooltip title="复制">
        <Button
          shape="circle"
          icon={<CopyOutlined />}
          onClick={copy}
          disabled={selectedId === ''}
        ></Button>
      </Tooltip>
      <Tooltip title="粘贴">
        <Button
          shape="circle"
          icon={<BlockOutlined />}
          disabled={copiedComponent === null}
          onClick={paset}
        ></Button>
      </Tooltip>
      <Tooltip title="上移">
        <Button
          shape="circle"
          icon={<ArrowUpOutlined />}
          onClick={moveUp}
          disabled={isFirst}
        ></Button>
      </Tooltip>
      <Tooltip title="下移">
        <Button
          shape="circle"
          icon={<ArrowDownOutlined />}
          onClick={moveDown}
          disabled={isLast}
        ></Button>
      </Tooltip>
      <Tooltip title="撤销">
        <Button shape="circle" icon={<UndoOutlined />} onClick={undo}></Button>
      </Tooltip>
      <Tooltip title="重做">
        <Button shape="circle" icon={<RedoOutlined />} onClick={redo}></Button>
      </Tooltip>
    </Space>
  );
};

export default EditToolbar;
