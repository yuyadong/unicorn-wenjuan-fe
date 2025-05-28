import { configureStore } from '@reduxjs/toolkit';
import undoable, { excludeAction, type StateWithHistory } from 'redux-undo';
import userReducer, { type UserStateType } from './userReducer';
import componentsRender, { type ComponentsStateType } from './componentsReducer';
import pageInfoReducer, { type PageInfoType } from './pageInfoReducer';

export type StateType = {
  user: UserStateType;
  components: StateWithHistory<ComponentsStateType>;
  pageInfo: PageInfoType;
};

export default configureStore({
  reducer: {
    user: userReducer,
    components: undoable(componentsRender, {
      limit: 20,
      filter: excludeAction([
        'components/resetComponents',
        'components/changeSelectedId',
        'components/selectedPrevComponent',
        'components/selectedNextComponent',
      ]),
    }),
    pageInfo: pageInfoReducer,
  },
});
