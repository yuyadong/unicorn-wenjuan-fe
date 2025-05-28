import React from 'react';
import { componentConfGroup, type ComponentConfType } from '@/components/QuestionComponents';
import { Typography } from 'antd';
import styles from './ComponentLib.module.scss';
import { useDispatch } from 'react-redux';
import { addComponent } from '@/store/componentsReducer';
import { nanoid } from 'nanoid';

const { Title } = Typography;

function genComponent(c: ComponentConfType) {
  const dispatch = useDispatch();
  const { title, type, Component, defaultProps } = c;

  function handleClick() {
    dispatch(
      addComponent({
        fe_id: nanoid(),
        title,
        type,
        props: defaultProps,
      }),
    );
  }

  return (
    <div className={styles.wrapper} key={type} onClick={handleClick}>
      <div className={styles.component}>
        <Component />
      </div>
    </div>
  );
}

const ComponentLib: React.FC = () => {
  return (
    <div>
      {componentConfGroup.map((group, index) => {
        const { groupId, groupName, components } = group;
        return (
          <div key={groupId}>
            <Title
              level={3}
              style={{
                fontSize: 16,
                marginTop: index > 0 ? 20 : 0,
              }}
            >
              {groupName}
            </Title>
            <div>{components.map(c => genComponent(c))}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ComponentLib;
