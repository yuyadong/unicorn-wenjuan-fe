import React, { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Input } from 'antd';
import { LIST_SEARCH_PARASM_KEY } from '@/constant';

const { Search } = Input;

const ListSearch: React.FC = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const [value, setValue] = useState<string>('');

  // 获取 url 参数，并设置到 input value
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const curVal = searchParams.get(LIST_SEARCH_PARASM_KEY) || '';
    setValue(curVal);
  }, [searchParams]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSearch = (value: string) => {
    console.log(value);
    nav({
      pathname,
      search: `${LIST_SEARCH_PARASM_KEY}=${value}`,
    });
  };

  return (
    <Search
      placeholder="请输入关键字"
      onSearch={handleSearch}
      onChange={handleChange}
      style={{ width: 300 }}
      value={value}
      size="large"
      allowClear
    />
  );
};

export default ListSearch;
