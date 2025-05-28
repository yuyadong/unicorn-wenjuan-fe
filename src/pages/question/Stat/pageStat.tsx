import { getQuestionStatListService } from '@/services/stat';
import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Table, Pagination } from 'antd';
import SpinLoading from '@/components/SpinLoading';
import useGetComponentInfo from '@/hooks/useGetComponentInfo';
import { STAT_PAGE_SIZE } from '@/constant';

const { Title } = Typography;

type PropsType = {
  selectedComponentId: string;
  setSelectedComponentId: (id: string) => void;
  setSelectedComponentType: (type: string) => void;
};

const PageStat: React.FC<PropsType> = (props: PropsType) => {
  const { selectedComponentId, setSelectedComponentId, setSelectedComponentType } = props;
  const { id = '' } = useParams();
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(STAT_PAGE_SIZE);

  const { loading } = useRequest(
    async () => await getQuestionStatListService(id, { page, pageSize }),
    {
      refreshDeps: [page, pageSize],
      onSuccess(res) {
        const { total, list = [] } = res;
        setTotal(total);
        setList(list);
      },
    },
  );

  const { componentList } = useGetComponentInfo();
  const columns = componentList.map(c => {
    const { fe_id, title, type, props = {} } = c;

    const colTitle = props!.title || title;

    return {
      title: (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setSelectedComponentId(fe_id);
            setSelectedComponentType(type);
          }}
        >
          {
            <span
              style={{
                color: fe_id === selectedComponentId ? '#1890ff' : 'initial',
              }}
            >
              {colTitle}
            </span>
          }
        </div>
      ),
      dataIndex: fe_id,
    };
  });

  const dataSource = list.map((i: any) => ({
    ...i,
    key: i._id,
  }));
  const TableElem = (
    <>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 18,
        }}
      >
        <Pagination
          total={total}
          pageSize={pageSize}
          current={page}
          onChange={page => setPage(page)}
          onShowSizeChange={(page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          }}
        />
      </div>
    </>
  );

  return (
    <div>
      <Title level={3}>答卷数量: {!loading && total}</Title>
      {loading && (
        <div
          style={{
            textAlign: 'center',
            marginTop: 16,
          }}
        >
          <SpinLoading />
        </div>
      )}
      {!loading && TableElem}
    </div>
  );
};

export default PageStat;
