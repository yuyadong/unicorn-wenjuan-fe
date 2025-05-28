import React from 'react';
import useGetComponentInfo from '@/hooks/useGetComponentInfo';
import {
  getComponentConfByType,
  type ComponentConfType,
  type ComponentPropsType,
} from '@/components/QuestionComponents';
import { useDispatch } from 'react-redux';
import { changeComponentProps } from '@/store/componentsReducer';

const NoProp: React.FC = () => <div style={{ textAlign: 'center' }}>未选中组件</div>;

const ComponentProp: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedComponent } = useGetComponentInfo();
  if (selectedComponent == null) return <NoProp />;
  const { type, props, isLocked, isHidden } = selectedComponent;
  const conponentConf = getComponentConfByType(type);
  if (conponentConf == null) return <NoProp />;
  function changeProps(newProps: ComponentPropsType) {
    if (selectedComponent == null) return;
    const { fe_id } = selectedComponent;
    dispatch(changeComponentProps({ fe_id, newProps }));
  }

  const { PropComponent } = conponentConf as ComponentConfType;
  return <PropComponent {...props} onChange={changeProps} disabled={isLocked || isHidden} />;
};

export default ComponentProp;
