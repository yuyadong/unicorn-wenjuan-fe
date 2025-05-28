import React, { useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, message, Space, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import styles from './EditHeader.module.scss';
import EditToolbar from './EditToolbar';
import { SaveOutlined, GlobalOutlined, EditOutlined } from '@ant-design/icons';
import useGetPageInfo from '@/hooks/useGetPageInfo';
import { useDispatch } from 'react-redux';
import { changePageTitle } from '@/store/pageInfoReducer';
import useGetComponentInfo from '@/hooks/useGetComponentInfo';
import { useDebounceEffect, useKeyPress, useRequest } from 'ahooks';
import { updateQuestionService } from '@/services/question';
import SpinLoading from '@/components/SpinLoading';

const { Title } = Typography;

const TitleElem: React.FC = () => {
  const { title } = useGetPageInfo();
  const [editState, setEditState] = useState(false);
  const dispatch = useDispatch();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value.trim();
    if (!newTitle) return;
    dispatch(changePageTitle(newTitle));
  }

  if (editState) {
    return (
      <Input
        value={title}
        onBlur={() => setEditState(false)}
        onPressEnter={() => setEditState(false)}
        onChange={handleChange}
      />
    );
  }

  return (
    <Space>
      <Title>{title}</Title>
      <Button icon={<EditOutlined />} type="text" onClick={() => setEditState(true)} />
    </Space>
  );
};

const SaveButton: React.FC = () => {
  const { id } = useParams();
  const { componentList = [] } = useGetComponentInfo();
  const pageInfo = useGetPageInfo();

  const { loading, run: save } = useRequest(
    async () => {
      if (!id) return;
      await updateQuestionService(id, { ...pageInfo, componentList });
    },
    {
      manual: true,
      onSuccess() {
        // message.success("保存成功");
      },
    },
  );

  useKeyPress(['ctrl.s', 'meta.s'], (event: KeyboardEvent) => {
    event.preventDefault();
    if (!loading) save();
  });

  useDebounceEffect(
    () => {
      save();
    },
    [componentList, pageInfo],
    { wait: 1000 },
  );

  return (
    <Button
      icon={loading ? <SpinLoading size="small" /> : <SaveOutlined />}
      onClick={save}
      disabled={loading}
    >
      保存
    </Button>
  );
};

const PublishButton: React.FC = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const { componentList = [] } = useGetComponentInfo();
  const pageInfo = useGetPageInfo();

  const { loading, run: pub } = useRequest(
    async () => {
      if (!id) return;
      await updateQuestionService(id, {
        ...pageInfo,
        componentList,
        idPublish: true,
      });
    },
    {
      manual: true,
      onSuccess() {
        message.success('发布成功');
        nav(`/question/stat/${id}`);
      },
    },
  );
  return (
    <Button
      icon={loading ? <SpinLoading size="small" /> : <GlobalOutlined />}
      type="primary"
      onClick={pub}
    >
      发布
    </Button>
  );
};

const EditHeader: React.FC = () => {
  const nav = useNavigate();

  return (
    <div className={styles['header-wrapper']}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Space>
            <Button type="link" icon={<LeftOutlined />} onClick={() => nav(-1)}>
              返回
            </Button>
            <TitleElem />
          </Space>
        </div>
        <div className={styles.main}>
          <EditToolbar />
        </div>
        <div className={styles.right}>
          <Space>
            <SaveButton />
            <PublishButton />
          </Space>
        </div>
      </div>
    </div>
  );
};

export default EditHeader;
