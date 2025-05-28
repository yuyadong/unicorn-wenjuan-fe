import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Space, Form, Input, Button, Checkbox, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import styles from './common.module.scss';
import { REGISTER_PATHNAME, MANAGE_INDEX_PATHNAME } from '@/router';
import { useRequest } from 'ahooks';
import { loginService } from '@/services/user';
import { setToken } from '@/utils/userToken';

const { Title } = Typography;

const USERNAME_KEY = 'USERNAME';
const PASSWORD_KEY = 'PASSWORD';

function rememberUserStorage(username: string, password: string) {
  localStorage.setItem(USERNAME_KEY, username);
  localStorage.setItem(PASSWORD_KEY, password);
}

function deleteUserStorage() {
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(PASSWORD_KEY);
}

function getUserStorage() {
  return {
    username: localStorage.getItem(USERNAME_KEY),
    password: localStorage.getItem(PASSWORD_KEY),
  };
}

const Login: React.FC = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const { username, password } = getUserStorage();
    form.setFieldsValue({ username, password });
  }, []);

  const { run } = useRequest(
    async (username: string, password: string) => await loginService(username, password),
    {
      manual: true,
      onSuccess(result) {
        const { token } = result;
        setToken(token);
        message.success('登录成功');
        nav(MANAGE_INDEX_PATHNAME);
      },
    },
  );

  const onFinish = (values: any) => {
    const { username, password, remember } = values;

    run(username, password);

    if (remember) {
      rememberUserStorage(username, password);
    } else {
      deleteUserStorage();
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <Space>
          <Title level={2}>
            <UserAddOutlined />
          </Title>
          <Title level={2}>用户登录</Title>
        </Space>
      </div>
      <div>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          initialValues={{ remember: true }}
          form={form}
        >
          <Form.Item label="用户名" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="密码" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 6, span: 16 }}>
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                登录
              </Button>
              <Link to={REGISTER_PATHNAME}>注册新用户</Link>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
