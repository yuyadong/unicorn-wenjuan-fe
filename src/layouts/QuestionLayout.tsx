import React from 'react';
import { Outlet } from 'react-router-dom';
import useLoadUserData from '@/hooks/useLoadUserData';
import SpinLoading from '@/components/SpinLoading';
import useNavPage from '@/hooks/useNavPage';

const QuestionLayout: React.FC = () => {
  const { waitingUserData } = useLoadUserData();
  useNavPage(waitingUserData);

  return (
    <div>
      {waitingUserData ? (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SpinLoading size="large" />
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default QuestionLayout;
