import React, { useRef } from 'react';
import styles from './StatHeader.module.scss';
import { Button, Input, type InputRef, message, Space, Tooltip, QRCode, Popover } from 'antd';
import { CopyOutlined, LeftOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import useGetPageInfo from '@/hooks/useGetPageInfo';

const StatHeader: React.FC = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const { title, isPublish } = useGetPageInfo();

  const urlInputRef = useRef<InputRef>(null);
  function copy() {
    const elem = urlInputRef.current;
    if (elem === null) return;
    elem.select();
    document.execCommand('copy');
    message.success('拷贝成功');
  }

  function genLinkAndQRCodeElem() {
    if (!isPublish) return null;
    const url = `http://localhost:3000/question/stat/${id}`;

    const QRCodeElem = (
      <div style={{ textAlign: 'center' }}>
        <QRCode value={url} size={150} />
      </div>
    );

    return (
      <Space>
        <Input value={url} style={{ width: 300 }} ref={urlInputRef} />

        <Tooltip title="拷贝链接">
          <Button icon={<CopyOutlined />} onClick={copy} />
        </Tooltip>
        <Popover content={QRCodeElem}>
          <Button icon={<QrcodeOutlined />} />
        </Popover>
      </Space>
    );
  }

  return (
    <div className={styles['header-wrapper']}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Space>
            <Button type="link" icon={<LeftOutlined />} onClick={() => nav(-1)}>
              返回
            </Button>
            <h1>{title}</h1>
          </Space>
        </div>
        <div className={styles.main}>{genLinkAndQRCodeElem()}</div>
        <div className={styles.right}>
          <Button type="primary" onClick={() => nav(`/question/edit/${id}`)}>
            编辑问卷
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatHeader;
