import { useKeyPress } from 'ahooks';
import { useDispatch } from 'react-redux';
import {
  copySelectedComponent,
  pasetCopiedComponent,
  removeSelectedComponent,
  selectedPrevComponent,
  selectedNextComponent,
} from '@/store/componentsReducer';
import { ActionCreators } from 'redux-undo';

function isActiveElementValid() {
  const activeElem = document.activeElement;
  if (activeElem === document.body) return true;
  if (activeElem?.matches('div[role="button"]')) return true;
  return false;
}

function useBindCanvasKeyPress() {
  const dispatch = useDispatch();

  useKeyPress(['backspace', 'delete'], () => {
    if (!isActiveElementValid()) return;
    dispatch(removeSelectedComponent());
  });

  useKeyPress(['ctrl.c', 'meta.c'], () => {
    if (!isActiveElementValid()) return;
    dispatch(copySelectedComponent());
  });

  useKeyPress(['ctrl.v', 'meta.v'], () => {
    if (!isActiveElementValid()) return;
    dispatch(pasetCopiedComponent());
  });

  useKeyPress(['uparrow'], () => {
    if (!isActiveElementValid()) return;
    dispatch(selectedPrevComponent());
  });

  useKeyPress(['downarrow'], () => {
    if (!isActiveElementValid()) return;
    dispatch(selectedNextComponent());
  });

  useKeyPress(
    ['ctrl.z', 'meta.z'],
    () => {
      if (!isActiveElementValid()) return;
      dispatch(ActionCreators.undo());
    },
    { exactMatch: true },
  );

  useKeyPress(['ctrl.shift.z', 'meta.shift.z'], () => {
    if (!isActiveElementValid()) return;
    dispatch(ActionCreators.redo());
  });
}

export default useBindCanvasKeyPress;
