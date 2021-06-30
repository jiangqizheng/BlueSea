
  import { createClientFetchProxy } from '../utils/fetch';
  
  type xBody = {
  id?: number;
  parentId?:number;
  content: string;
  comment: string;
};
  export const hi: (p: any) => Promise<any> = createClientFetchProxy('grammar', 'hi') as any
  export const addMaterial: (body: xBody) => Promise<void> = createClientFetchProxy('grammar', 'addMaterial') as any
export const delMaterial: (id: string) => Promise<void> = createClientFetchProxy('grammar', 'delMaterial') as any
export const updateMaterial: (body: xBody) => Promise<void> = createClientFetchProxy('grammar', 'updateMaterial') as any
export const getMaterialList: () => Promise<any[]> = createClientFetchProxy('grammar', 'getMaterialList') as any
export const addKnowledge: (body: xBody) => Promise<void> = createClientFetchProxy('grammar', 'addKnowledge') as any
export const delKnowledge: (id: string) => Promise<void> = createClientFetchProxy('grammar', 'delKnowledge') as any
export const updateKnowledge: (body: xBody) => Promise<void> = createClientFetchProxy('grammar', 'updateKnowledge') as any
export const getKnowledgeList: (words: string[]) => Promise<any[]> = createClientFetchProxy('grammar', 'getKnowledgeList') as any
  