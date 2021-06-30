
  import { createClientFetchProxy } from '../utils/fetch';
  
  type xBody = {
  id?: number;
  parentId?: number;
  content: string;
  comment: string;
};
  export const hi: (p: any) => Promise<any> = createClientFetchProxy('tag', 'hi') as any
  export const add: (body: xBody) => Promise<void> = createClientFetchProxy('tag', 'add') as any
export const del: (id: string) => Promise<void> = createClientFetchProxy('tag', 'del') as any
export const update: (body: xBody) => Promise<void> = createClientFetchProxy('tag', 'update') as any
export const getList: (words: string[]) => Promise<any[]> = createClientFetchProxy('tag', 'getList') as any
  