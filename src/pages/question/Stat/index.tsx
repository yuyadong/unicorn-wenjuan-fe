import React, { useState } from 'react';
import useLoadQuestionData from '@/hooks/useLoadQuestionData';
import SpinLoading from '@/components/SpinLoading';
import useGetPageInfo from '@/hooks/useGetPageInfo';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTitle } from 'ahooks';
import styles from './index.module.scss';
import StatHeader from './StatHeader';
import ComponentList from './ComponentList';
import PageStat from './pageStat';
import ChartStat from './ChartStat';

const Stat: React.FC = () => {
  const nav = useNavigate();
  const { loading } = useLoadQuestionData();
  const { isPublished, title } = useGetPageInfo();
  const [selectedComponentId, setSelectedComponentId] = useState('');
  const [selectedComponentType, setSelectedComponentType] = useState('');

  useTitle(`问卷统计- ${title}`);

  const loadingElem = (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SpinLoading />
    </div>
  );

  function genContentElem() {
    if (typeof isPublished === 'boolean' && !isPublished) {
      return (
        <Result
          status="warning"
          title="该页面尚未发布"
          extra={
            <Button type="primary" onClick={() => nav(-1)}>
              返回
            </Button>
          }
        />
      );
    }

    return (
      <>
        <div className={styles.left}>
          <ComponentList
            selectedComponentId={selectedComponentId}
            setSelectedComponentId={setSelectedComponentId}
            setSelectedComponentType={setSelectedComponentType}
          />
        </div>
        <div className={styles.main}>
          <PageStat
            selectedComponentId={selectedComponentId}
            setSelectedComponentId={setSelectedComponentId}
            setSelectedComponentType={setSelectedComponentType}
          />
        </div>
        <div className={styles.right}>
          <ChartStat
            selectedComponentId={selectedComponentId}
            selectedComponentType={selectedComponentType}
          />
        </div>
      </>
    );
  }

  return (
    <div className={styles.container}>
      {loading && loadingElem}
      <StatHeader />
      <div className={styles['content-wrapper']}>
        {!loading && <div className={styles.content}>{genContentElem()}</div>}
      </div>
    </div>
  );
};

export default Stat;
