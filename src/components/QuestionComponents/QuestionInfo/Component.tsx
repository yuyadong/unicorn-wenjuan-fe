import React from 'react';
import { Typography } from 'antd';
import { type QuestionInfoPropsType, QuestionInfoDefaultProps } from './interface';

const { Title, Paragraph } = Typography;

const Component: React.FC<QuestionInfoPropsType> = (props: QuestionInfoPropsType) => {
  const { title, desc = '' } = { ...QuestionInfoDefaultProps, ...props };

  const descTextList = desc.split('\n');

  return (
    <div style={{ textAlign: 'center' }}>
      <Title style={{ fontSize: '24px' }}>{title}</Title>
      <Paragraph>
        {descTextList.map((t, index) => (
          <span key={index}>
            {index > 0 && <br />}
            {t}
          </span>
        ))}
      </Paragraph>
    </div>
  );
};

export default Component;
