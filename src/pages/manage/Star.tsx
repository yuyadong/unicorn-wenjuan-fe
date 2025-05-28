import React from 'react';
import { useTitle } from 'ahooks';
import { Typography, Spin, Empty } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './common.module.scss';
import QuestionCard from '@/components/QuestionCard';
import ListSearch from '@/components/ListSearch';
import useLoadQuestionListData from '@/hooks/useLoadQuestionListData';
import ListPage from '@/components/ListPage';

const { Title } = Typography;

const Star: React.FC = () => {
  useTitle('独角兽问卷 - 星标问卷');

  const { loading, data = {} } = useLoadQuestionListData({ isStar: true });
  const { list = [], total = 0 } = data;

  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>我的问卷</Title>
        </div>
        <div className={styles.right}>
          <ListSearch />
        </div>
      </div>
      <div className={styles.content}>
        <div style={{ textAlign: 'center' }}>
          {loading && <Spin indicator={<LoadingOutlined spin />} size="large" />}
        </div>
        {!loading && list.length === 0 && <Empty description="暂无数据" />}
        {!loading &&
          list.length > 0 &&
          list.map((q: any) => {
            const { _id } = q;
            return <QuestionCard key={_id} {...q} />;
          })}
      </div>
      <div className={styles.footer}>{!loading && <ListPage total={total} />}</div>
    </>
  );
};

export default Star;
