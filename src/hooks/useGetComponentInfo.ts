import { useSelector } from 'react-redux';
import { type StateType } from '@/store';
import { type ComponentsStateType } from '@/store/componentsReducer';

function useGetComponentInfo() {
  const components = useSelector<StateType>(
    state => state.components.present,
  ) as ComponentsStateType;

  const { componentList, selectedId, copiedComponent } = components;

  const selectedComponent = componentList.find(c => c.fe_id === selectedId);

  return {
    componentList,
    selectedId,
    selectedComponent,
    copiedComponent,
  };
}

export default useGetComponentInfo;
