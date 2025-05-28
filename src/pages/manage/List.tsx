import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTitle, useDebounceFn, useRequest } from 'ahooks';
import { Typography, Empty } from 'antd';

import styles from './common.module.scss';
import QuestionCard from '@/components/QuestionCard';
import ListSearch from '@/components/ListSearch';
import { getQuestionListService } from '@/services/question';
import { LIST_PAGE_SIZE, LIST_SEARCH_PARASM_KEY } from '@/constant';
import SpinLoading from '@/components/SpinLoading';

const { Title } = Typography;

const List: React.FC = () => {
  useTitle('独角兽问卷 - 我的问卷');

  const [searchParams] = useSearchParams();

  const [started, setStarted] = useState(false);
  const [page, setPage] = useState(1);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const haveMoreData = total > list.length;

  const keyword = searchParams.get(LIST_SEARCH_PARASM_KEY) || '';
  useEffect(() => {
    setStarted(false);
    setPage(1);
    setList([]);
    setTotal(0);
  }, [keyword]);
  // 真正加载
  const { run: load, loading } = useRequest(
    async () => {
      const data = await getQuestionListService({
        page,
        pageSize: LIST_PAGE_SIZE,
        keyword: searchParams.get(LIST_SEARCH_PARASM_KEY) || '',
      });
      return data;
    },
    {
      manual: true,
      onSuccess(result) {
        const { list: l = [], total = 0 } = result;
        setPage(page + 1);
        setList(list.concat(l));
        setTotal(total);
      },
    },
  );

  // 触发加载防抖
  const containerRef = useRef<HTMLDivElement>(null);
  const { run: tryLoadMore } = useDebounceFn(
    () => {
      const elem = containerRef.current;
      if (elem === null) return;
      const domRect = elem.getBoundingClientRect();
      if (domRect === null) return;
      const { bottom } = domRect;
      if (bottom <= document.body.clientHeight) {
        load();
        setStarted(true);
      }
    },
    {
      wait: 1000,
    },
  );

  // 页面加载
  useEffect(() => {
    tryLoadMore();
  }, [searchParams]);

  // 页面滚动触发加载
  useEffect(() => {
    if (haveMoreData) {
      window.addEventListener('scroll', tryLoadMore);
    }
    return () => {
      window.removeEventListener('scroll', tryLoadMore);
    };
  }, [searchParams, haveMoreData]);

  const LoadMoreContentElem = useMemo(() => {
    if (!started || loading) return <SpinLoading size="large" />;
    if (total === 0) return <Empty description="暂无数据" />;
    if (!haveMoreData) <span>没有更多了</span>;
    return <span>开始加载下一页</span>;
  }, [started, loading, haveMoreData, total]);

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
        {list.length > 0 &&
          list.map((q: any) => {
            const { _id } = q;
            return <QuestionCard key={_id} {...q} />;
          })}
      </div>
      <div className={styles.footer}>
        <div ref={containerRef}>{LoadMoreContentElem}</div>
      </div>
    </>
  );
};

export default List;
