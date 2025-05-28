import { useRequest } from 'ahooks';
import { useSearchParams } from 'react-router-dom';
import { getQuestionListService } from '../services/question';
import {
  LIST_SEARCH_PARASM_KEY,
  LIST_PAGE_PARASM_KEY,
  LIST_PAGE_SIZE_PARASM_KEY,
  LIST_PAGE_SIZE,
} from '../constant';
type OptionType = {
  isStar: boolean;
  isDeleted: boolean;
};

function useLoadQuestionListData(opt: Partial<OptionType> = {}) {
  const { isStar, isDeleted } = opt;
  const [searchParams] = useSearchParams();
  const {
    loading,
    error,
    data = {},
    refresh,
  } = useRequest(
    async () => {
      const keyword = searchParams.get(LIST_SEARCH_PARASM_KEY) || '';
      const page = parseInt(searchParams.get(LIST_PAGE_PARASM_KEY) || '') || 1;
      const pageSize =
        parseInt(searchParams.get(LIST_PAGE_SIZE_PARASM_KEY) || '') || LIST_PAGE_SIZE;
      const data = await getQuestionListService({
        keyword,
        isStar,
        isDeleted,
        page,
        pageSize,
      });
      return data;
    },
    {
      refreshDeps: [searchParams], // 刷新 url 依赖
    },
  );

  return { loading, error, data, refresh };
}

export default useLoadQuestionListData;
