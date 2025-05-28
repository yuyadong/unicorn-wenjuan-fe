import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRequest } from 'ahooks';
import styles from './QuestionCard.module.scss';
import { Space, Button, Divider, Tag, Popconfirm, message } from 'antd';
import {
  EditOutlined,
  LineChartOutlined,
  StarOutlined,
  CopyOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import { updateQuestionService, duplicateQuestionService } from '@/services/question';
import SpinLoading from '@/components/SpinLoading';

type PropsType = {
  _id: string;
  title: string;
  isPublished: boolean;
  isStar: boolean;
  answerCount: number;
  createAt: string;
};

const QuestionCard: React.FC<PropsType> = (props: PropsType) => {
  const nav = useNavigate();
  const { _id, title, answerCount, createAt, isPublished, isStar } = props;

  // 修改标星
  const [isStarState, setIsStarState] = useState(isStar);
  const { loading: changeStarLoading, run: changeStar } = useRequest(
    async () => await updateQuestionService(_id, { isStar: !isStarState }),
    {
      manual: true,
      onSuccess() {
        setIsStarState(!isStarState);
        message.success('更新成功');
      },
    },
  );

  const { loading: duplicateLoading, run: duplicate } = useRequest(
    async () => await duplicateQuestionService(_id),
    {
      manual: true,
      onSuccess(result) {
        const { id } = result;
        message.success('复制成功');
        nav(`/question/edit/${id}`);
      },
    },
  );

  const [isDeletedState, setIsDeletedState] = useState(false);
  const { loading: delLoading, run: del } = useRequest(
    async () => updateQuestionService(_id, { isDeleted: true }),
    {
      manual: true,
      onSuccess() {
        message.success('删除成功');
        setIsDeletedState(true);
      },
    },
  );

  if (isDeletedState) return null;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div className={styles.left}>
          <Link to={isPublished ? `/question/stat/${_id}` : `/question/edit/${_id}`}>
            <Space>
              {isStarState && <StarOutlined style={{ color: 'red' }} />}
              {title}
            </Space>
          </Link>
        </div>
        <div className={styles.right}>
          <Space>
            {isPublished ? <Tag color="processing">已发布</Tag> : <Tag>未发布</Tag>}
            <span>答卷：{answerCount}</span>
            <span>{createAt}</span>
          </Space>
        </div>
      </div>
      <Divider style={{ margin: '12px 0' }} />
      <div className={styles['button-container']}>
        <div className={styles.left}>
          <Space>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => nav(`/question/edit/${_id}`)}
            >
              编辑问卷
            </Button>
            <Button
              type="text"
              size="small"
              icon={<LineChartOutlined />}
              onClick={() => nav(`/question/stat/${_id}`)}
              disabled={!isPublished}
            >
              问卷统计
            </Button>
          </Space>
        </div>
        <div className={styles.right}>
          <Space>
            <Button
              type="text"
              size="small"
              color="default"
              variant="outlined"
              icon={changeStarLoading ? <SpinLoading size="small" /> : <StarOutlined />}
              onClick={changeStar}
              disabled={changeStarLoading}
            >
              {isStarState ? '取消标星' : '标星'}
            </Button>
            <Popconfirm
              title="确定复制该问卷？"
              okText="确定"
              cancelText="取消"
              onConfirm={duplicate}
            >
              <Button
                type="text"
                size="small"
                icon={duplicateLoading ? <SpinLoading size="small" /> : <CopyOutlined />}
                color="default"
                variant="outlined"
                disabled={duplicateLoading}
              >
                复制
              </Button>
            </Popconfirm>
            <Popconfirm title="确定删除该问卷？" okText="确定" cancelText="取消" onConfirm={del}>
              <Button
                type="text"
                size="small"
                icon={delLoading ? <SpinLoading size="small" /> : <DeleteOutlined />}
                color="default"
                variant="outlined"
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
