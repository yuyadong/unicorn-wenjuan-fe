import { useSelector } from 'react-redux';
import { type StateType } from '@/store';
import { type UserStateType } from '@/store/userReducer';

function useGetUserInfo() {
  const { username, nickname } = useSelector<StateType>(state => state.user) as UserStateType;
  return { username, nickname };
}

export default useGetUserInfo;
