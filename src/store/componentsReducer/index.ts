import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type ComponentPropsType } from '@/components/QuestionComponents';
import { getNextSelectedId, inserNewComponent } from './utils';
import clonedeep from 'lodash.clonedeep';
import { nanoid } from 'nanoid';
import { arrayMove } from '@dnd-kit/sortable';
export type ComponentInfoType = {
  fe_id: string;
  type: string;
  title: string;
  isHidden?: boolean;
  isLocked?: boolean;
  props: ComponentPropsType;
};

export type ComponentsStateType = {
  selectedId: string;
  componentList: ComponentInfoType[];
  copiedComponent: ComponentInfoType | null;
};

const INIT_STATE: ComponentsStateType = {
  selectedId: '',
  componentList: [],
  copiedComponent: null,
};

export const componentsSlice = createSlice({
  name: 'components',
  initialState: INIT_STATE,
  reducers: {
    // 重置所有组件
    resetComponents: (_state: ComponentsStateType, action: PayloadAction<ComponentsStateType>) =>
      action.payload,
    // 修改 selectedId
    changeSelectedId: (state: ComponentsStateType, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
    // 添加新组件
    addComponent: (state: ComponentsStateType, action: PayloadAction<ComponentInfoType>) => {
      const newComponent = action.payload;

      inserNewComponent(state, newComponent);
    },
    // 修改组件属性
    changeComponentProps: (
      state: ComponentsStateType,
      action: PayloadAction<{ fe_id: string; newProps: ComponentPropsType }>,
    ) => {
      const { fe_id, newProps } = action.payload;

      const curComp = state.componentList.find(c => c.fe_id === fe_id);

      if (curComp) {
        curComp.props = { ...curComp.props, ...newProps };
      }
    },
    // 删除选中组件
    removeSelectedComponent: (state: ComponentsStateType) => {
      const { componentList, selectedId: removeId } = state;

      const newSelectedId = getNextSelectedId(removeId, componentList);
      state.selectedId = newSelectedId;

      const index = componentList.findIndex(c => c.fe_id === removeId);
      componentList.splice(index, 1);
    },
    // 显示隐藏组件
    changeComponentHidden: (
      state: ComponentsStateType,
      action: PayloadAction<{ fe_id: string; isHidden: boolean }>,
    ) => {
      const { componentList } = state;
      const { fe_id, isHidden } = action.payload;

      let newSelectedId = '';
      if (isHidden) {
        newSelectedId = getNextSelectedId(fe_id, componentList);
      } else {
        newSelectedId = fe_id;
      }

      state.selectedId = newSelectedId;

      const curComp = componentList.find(c => c.fe_id === fe_id);
      if (curComp) {
        curComp.isHidden = isHidden;
      }
    },
    // 锁定/解锁 组件
    toggleComponentLocked: (
      state: ComponentsStateType,
      action: PayloadAction<{ fe_id: string }>,
    ) => {
      const { fe_id } = action.payload;

      const curComp = state.componentList.find(c => c.fe_id === fe_id);
      if (curComp) {
        curComp.isLocked = !curComp.isLocked;
      }
    },
    // 复制
    copySelectedComponent: (state: ComponentsStateType) => {
      const { selectedId, componentList } = state;

      const curComp = componentList.find(c => c.fe_id === selectedId);
      if (curComp === null) return;
      state.copiedComponent = clonedeep(curComp)!;
    },
    // 复制
    pasetCopiedComponent: (state: ComponentsStateType) => {
      const { copiedComponent } = state;

      if (copiedComponent === null) return;

      copiedComponent.fe_id = nanoid();

      inserNewComponent(state, copiedComponent);
    },
    // 上移
    selectedPrevComponent: (state: ComponentsStateType) => {
      const { selectedId, componentList } = state;
      const index = componentList.findIndex(c => c.fe_id === selectedId);

      if (index < 0) return; // 未选中
      if (index <= 0) return; // 已经选中第一个
      state.selectedId = componentList[index - 1].fe_id;
    },
    // 下移
    selectedNextComponent: (state: ComponentsStateType) => {
      const { selectedId, componentList } = state;
      const index = componentList.findIndex(c => c.fe_id === selectedId);
      if (index < 0) return; // 未选中
      if (index + 1 === componentList.length) return; // 已经选中最后一个
      state.selectedId = componentList[index + 1].fe_id;
    },
    // 修改组件标题
    changeComponentTitle: (
      state: ComponentsStateType,
      action: PayloadAction<{ fe_id: string; title: string }>,
    ) => {
      const { title, fe_id } = action.payload;
      const curComp = state.componentList.find(c => c.fe_id === fe_id);
      if (curComp) curComp.title = title;
    },
    moveComponent: (
      state: ComponentsStateType,
      action: PayloadAction<{ oldIndex: number; newIndex: number }>,
    ) => {
      const { componentList: curComponentList } = state;
      const { oldIndex, newIndex } = action.payload;

      state.componentList = arrayMove(curComponentList, oldIndex, newIndex);
    },
  },
});

export const {
  resetComponents,
  changeSelectedId,
  addComponent,
  changeComponentProps,
  removeSelectedComponent,
  changeComponentHidden,
  toggleComponentLocked,
  copySelectedComponent,
  pasetCopiedComponent,
  selectedPrevComponent,
  selectedNextComponent,
  changeComponentTitle,
  moveComponent,
} = componentsSlice.actions;

export default componentsSlice.reducer;
