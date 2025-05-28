import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useGetUserInfo from './useGetUserInfo';
import {
  isLoginOrRegister,
  isNotNeedUserInfo,
  LOGIN_PATHNAME,
  MANAGE_INDEX_PATHNAME,
} from '@/router';

function useNavPage(waitingUserData: boolean) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { username } = useGetUserInfo();

  useEffect(() => {
    if (waitingUserData) return;
    // 登录
    if (username) {
      if (isLoginOrRegister(pathname)) {
        nav(MANAGE_INDEX_PATHNAME);
      }
      return;
    }
    // 未登录
    if (isNotNeedUserInfo(pathname)) {
      return;
    } else {
      nav(LOGIN_PATHNAME);
    }
  }, [waitingUserData, username, pathname]);
}

export default useNavPage;
