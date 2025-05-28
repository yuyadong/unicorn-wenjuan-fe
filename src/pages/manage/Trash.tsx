import React, { useState } from 'react';
import { useTitle, useRequest } from 'ahooks';
import { Typography, Empty, Table, Tag, Button, Space, Popconfirm, message, Spin } from 'antd';
import { LoadingOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './common.module.scss';
import ListSearch from '@/components/ListSearch';
import useLoadQuestionListData from '@/hooks/useLoadQuestionListData';
import ListPage from '@/components/ListPage';
import { updateQuestionService, deleteQuestionService } from '@/services/question';
import SpinLoading from '@/components/SpinLoading';

const { Title } = Typography;

const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '是否发布',
    dataIndex: 'isPublished',
    key: 'isPublished',
    render: (isPublished: boolean) =>
      isPublished ? <Tag color="processing">已发布</Tag> : <Tag>未发布</Tag>,
  },
  {
    title: '答卷',
    dataIndex: 'answerCount',
    key: 'answerCount',
  },
  {
    title: '创建时间',
    dataIndex: 'createAt',
    key: 'createAt',
  },
];

const Trash: React.FC = () => {
  useTitle('独角兽问卷 - 回收站');

  const { loading, data = {}, refresh } = useLoadQuestionListData({ isDeleted: true });
  const { list = [], total = 0 } = data;

  // 记录选中 id
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { loading: recoveLoading, run: recove } = useRequest(
    async () => {
      for await (const id of selectedIds) {
        await updateQuestionService(id, { isDeleted: false });
      }
    },
    {
      manual: true,
      onSuccess() {
        message.success('恢复成功');
        setSelectedIds([]);
        refresh();
      },
    },
  );

  const { loading: delLoading, run: del } = useRequest(
    async () => await deleteQuestionService(selectedIds),
    {
      manual: true,
      onSuccess() {
        message.success('删除成功');
        setSelectedIds([]);
        refresh();
      },
    },
  );

  const TableElem = (
    <>
      <Space style={{ marginBottom: 20 }}>
        <Button
          type="primary"
          disabled={selectedIds.length === 0 || recoveLoading}
          onClick={recove}
          icon={recoveLoading ? <SpinLoading size="small" /> : <ReloadOutlined />}
        >
          恢复
        </Button>
        <Popconfirm
          title="确定删除该问卷？彻底删除后不能找回。"
          okText="确定"
          cancelText="取消"
          onConfirm={del}
        >
          <Button
            danger
            disabled={selectedIds.length === 0 || delLoading}
            icon={delLoading ? <SpinLoading size="small" /> : <DeleteOutlined />}
          >
            彻底删除
          </Button>
        </Popconfirm>
      </Space>
      <Table
        columns={columns}
        dataSource={list}
        pagination={false}
        rowKey={(record: any) => record._id}
        rowSelection={{
          type: 'checkbox',
          onChange: selectedRowKeys => {
            console.log('selectedRowKeys', selectedRowKeys);
            setSelectedIds(selectedRowKeys as string[]);
          },
        }}
      />
    </>
  );

  return (
    <>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title level={3}>回收站</Title>
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
        {!loading && list.length > 0 && TableElem}
      </div>
      <div className={styles.footer}>{!loading && <ListPage total={total} />}</div>
    </>
  );
};

export default Trash;
