import { type ComponentInfoType, type ComponentsStateType } from './index';

export function getNextSelectedId(fe_id: string, componentList: ComponentInfoType[]): string {
  const visibleComponentList = componentList.filter(c => !c.isHidden);
  const index = visibleComponentList.findIndex(c => c.fe_id === fe_id);

  if (index < 0) return '';

  let newSelectedId = '';
  const length = visibleComponentList.length;
  // 重新计算 selectedId
  if (length <= 1) {
    // 组件长度就一个，被删除了，就没有组件了
    newSelectedId = '';
  } else {
    // 组件长度 > 1
    if (index + 1 === length) {
      // 要删除最后一个
      newSelectedId = visibleComponentList[index - 1].fe_id;
    } else {
      // 不是删除最后一个
      newSelectedId = visibleComponentList[index + 1].fe_id;
    }
  }
  return newSelectedId;
}

export function inserNewComponent(draft: ComponentsStateType, newComponent: ComponentInfoType) {
  const { selectedId, componentList } = draft;
  const index = componentList.findIndex(c => c.fe_id === selectedId);

  if (index < 0) {
    componentList.push(newComponent);
  } else {
    componentList.splice(index + 1, 0, newComponent);
  }

  draft.selectedId = newComponent.fe_id;
}
