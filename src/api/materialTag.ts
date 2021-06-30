
  import { createClientFetchProxy } from '../utils/fetch';

  
  
  export const hi: (p: any) => Promise<any> = createClientFetchProxy('materialTag', 'hi') as any
  export const getList: () => Promise<import("/Users/weidian/work/0629/tt-woxue/entity/MaterialTag").MaterialTagModel[]> = createClientFetchProxy('materialTag', 'getList') as any
export const add: ({ text, desc }: { text: string; desc: string; }) => Promise<void> = createClientFetchProxy('materialTag', 'add') as any
export const del: (id: number) => Promise<void> = createClientFetchProxy('materialTag', 'del') as any
export const update: ({ id, text, desc }: { id: number; text: string; desc: string; }) => Promise<void> = createClientFetchProxy('materialTag', 'update') as any
  