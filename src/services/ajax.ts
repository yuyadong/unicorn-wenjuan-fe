import axios from 'axios';
import { message } from 'antd';
import { getToken } from '@/utils/userToken';

const instance = axios.create({
  timeout: 10 * 1000,
});

// request 拦截：统一处理 token
instance.interceptors.request.use(
  config => {
    config.headers['Authorization'] = `Bearer ${getToken()}`;
    return config;
  },
  error => Promise.reject(error),
);

// response 拦截：统一处理 errno 和 msg
instance.interceptors.response.use(res => {
  const resData = (res.data || {}) as ResType;
  const { errno, data, msg } = resData;

  if (errno !== 0) {
    // 错误提示
    if (msg) {
      message.error(msg);
    }
  }
  return data as any;
});

export default instance;

export type ResType = {
  errno: number;
  data?: ResDataType;
  msg?: string;
};

export type ResDataType = {
  [key: string]: any;
};
