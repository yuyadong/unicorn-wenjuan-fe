import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { getQuestionService } from '../services/question';
import { useDispatch } from 'react-redux';
import { resetComponents } from '@/store/componentsReducer';
import { resetPageInfo } from '@/store/pageInfoReducer';

function useLoadQuestionData() {
  const dispatch = useDispatch();
  const { id = '' } = useParams();

  const { loading, data, error, run } = useRequest(
    async (id: string) => {
      if (!id) throw Error('没有问卷 id');
      const data = getQuestionService(id);
      return data;
    },
    {
      manual: true,
    },
  );

  useEffect(() => {
    if (!data) return;
    const {
      title = '',
      desc = '',
      css = '',
      js = '',
      componentList = [],
      isPublish = false,
    } = data;

    let selectedId = '';
    if (componentList.length) {
      selectedId = componentList[0].fe_id;
    }

    dispatch(resetComponents({ componentList, selectedId, copiedComponent: null }));

    dispatch(resetPageInfo({ title, desc, css, js, isPublish }));
  }, [data]);

  useEffect(() => {
    run(id);
  }, [id]);

  return { loading, error };
}

export default useLoadQuestionData;
