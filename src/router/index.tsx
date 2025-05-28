import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';

const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const ManageLayout = lazy(() => import('@/layouts/ManageLayout'));
const QuestionLayout = lazy(() => import('@/layouts/QuestionLayout'));
const Home = lazy(() => import('@/pages/Home'));
const Demo = lazy(() => import('@/pages/Demo'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const List = lazy(() => import('@/pages/manage/List'));
const Star = lazy(() => import('@/pages/manage/Star'));
const Trash = lazy(() => import('@/pages/manage/Trash'));
const Edit = lazy(() => import('@/pages/question/Edit'));
const Stat = lazy(() => import('@/pages/question/Stat'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'demo',
        element: <Demo />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'manage',
        element: <ManageLayout />,
        children: [
          {
            path: 'list',
            element: <List />,
          },
          {
            path: 'star',
            element: <Star />,
          },
          {
            path: 'trash',
            element: <Trash />,
          },
        ],
      },

      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: 'question',
    element: <QuestionLayout />,
    children: [
      {
        path: 'edit/:id',
        element: <Edit />,
      },
      {
        path: 'stat/:id',
        element: <Stat />,
      },
    ],
  },
]);

export default router;

export const HOME_PATHNAME = '/';
export const LOGIN_PATHNAME = '/login';
export const REGISTER_PATHNAME = '/register';
export const MANAGE_INDEX_PATHNAME = '/manage/list';

export function isLoginOrRegister(pathname: string) {
  return [LOGIN_PATHNAME, REGISTER_PATHNAME].includes(pathname);
}
export function isNotNeedUserInfo(pathname: string) {
  return [HOME_PATHNAME, LOGIN_PATHNAME, REGISTER_PATHNAME].includes(pathname);
}
