import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

type PropsType = {
  size?: any;
};

const SpinLoading: React.FC<PropsType> = (props: PropsType) => {
  const { size = 'large' } = props;
  return <Spin indicator={<LoadingOutlined spin />} size={size} />;
};

export default SpinLoading;
