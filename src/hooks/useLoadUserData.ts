import { useState, useEffect } from 'react';

import { useRequest } from 'ahooks';
import { getUserInfoService } from '@/services/user';
import useGetUserInfo from '@/hooks/useGetUserInfo';
import { useDispatch } from 'react-redux';
import { loginReducer } from '@/store/userReducer';

function useLoadUserData() {
  const dispatch = useDispatch();
  const { username } = useGetUserInfo();
  const [waitingUserData, setWaitingUserData] = useState(true);

  const { run } = useRequest(getUserInfoService, {
    manual: true,
    onSuccess(result) {
      const { username, nickname } = result;
      dispatch(
        loginReducer({
          username,
          nickname,
        }),
      );
    },
    onFinally() {
      setWaitingUserData(false);
    },
  });

  useEffect(() => {
    if (username) {
      setWaitingUserData(false);
      return;
    }
    run();
  }, [username]);

  return { waitingUserData };
}

export default useLoadUserData;
