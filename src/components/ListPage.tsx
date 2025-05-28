import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Pagination } from 'antd';
import { LIST_PAGE_SIZE, LIST_PAGE_PARASM_KEY, LIST_PAGE_SIZE_PARASM_KEY } from '@/constant';

type PropsType = {
  total: number;
};

const ListPage: React.FC<PropsType> = (props: PropsType) => {
  const { total } = props;
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(LIST_PAGE_SIZE);

  useEffect(() => {
    const page = parseInt(searchParams.get(LIST_PAGE_PARASM_KEY) || '') || 1;
    const pageSize = parseInt(searchParams.get(LIST_PAGE_SIZE_PARASM_KEY) || '') || LIST_PAGE_SIZE;
    setPage(page);
    setPageSize(pageSize);
  }, [searchParams]);

  function onChange(page: number, pageSize: number) {
    searchParams.set(LIST_PAGE_PARASM_KEY, page.toString());
    searchParams.set(LIST_PAGE_SIZE_PARASM_KEY, pageSize.toString());
    nav({
      pathname,
      search: searchParams.toString(),
    });
  }

  return <Pagination current={page} pageSize={pageSize} total={total} onChange={onChange} />;
};

export default ListPage;
