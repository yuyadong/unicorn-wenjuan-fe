import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './ManageLayout.module.scss';
import { Space, Button, Divider, message } from 'antd';
import { BarsOutlined, StarOutlined, DeleteOutlined } from '@ant-design/icons';
import { createQuestionService } from '../services/question';
import { useRequest } from 'ahooks';

const ManageLayout: React.FC = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const buttonType = (path: string) => {
    return pathname.startsWith(path) ? 'default' : 'text';
  };

  const { loading, run: handleCreateClick } = useRequest(createQuestionService, {
    manual: true,
    onSuccess(result) {
      nav(`/question/edit/${result.id}`);
      message.success('创建成功');
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Space direction="vertical">
          <Button type="primary" onClick={handleCreateClick} disabled={loading}>
            新建问卷
          </Button>
          <Divider style={{ borderTop: 'transparent' }} />
          <Button
            type={buttonType('/manage/list')}
            icon={<BarsOutlined />}
            onClick={() => nav('/manage/list')}
          >
            我的问卷
          </Button>
          <Button
            type={buttonType('/manage/star')}
            icon={<StarOutlined />}
            onClick={() => nav('/manage/star')}
          >
            星标问卷
          </Button>
          <Button
            type={buttonType('/manage/trash')}
            icon={<DeleteOutlined />}
            onClick={() => nav('/manage/trash')}
          >
            回收站
          </Button>
        </Space>
      </div>
      <div className={styles.right}>
        <Outlet />
      </div>
    </div>
  );
};

export default ManageLayout;
