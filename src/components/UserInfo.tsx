import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LOGIN_PATHNAME } from '@/router';
import { UserOutlined } from '@ant-design/icons';
import { Space, Button, message } from 'antd';
import { removeToken } from '@/utils/userToken';
import useGetUserInfo from '@/hooks/useGetUserInfo';
import { logoutReducer } from '@/store/userReducer';

const UserInfo: React.FC = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();

  const { username = 'yuyadong', nickname } = useGetUserInfo();

  console.log('username', username);

  function login() {
    dispatch(logoutReducer());
    removeToken();
    nav(LOGIN_PATHNAME);
    message.success('退出成功');
  }

  const UserIfno = (
    <Space style={{ color: '#fff' }}>
      <UserOutlined />
      {nickname}
      <Button type="link" onClick={login}>
        退出
      </Button>
    </Space>
  );

  const Login = <Link to={LOGIN_PATHNAME}>登录</Link>;

  return <div>{username ? UserIfno : Login}</div>;
};

export default UserInfo;
