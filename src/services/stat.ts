import axios from './ajax';
import type { ResDataType } from './ajax';

export async function getQuestionStatListService(
  questionId: string,
  opt: { page: number; pageSize: number },
): Promise<ResDataType> {
  const url = `/api/stat/${questionId}`;
  const data = (await axios.get(url, { params: opt })) as ResDataType;
  return data;
}

export async function getComponentStatListService(
  questionId: string,
  componentId: string,
): Promise<ResDataType> {
  const url = `/api/stat/${questionId}/${componentId}`;
  const data = (await axios.get(url)) as ResDataType;
  return data;
}
