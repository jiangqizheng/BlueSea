
  import { createClientFetchProxy } from '../utils/fetch';

  
  
  export const hi: (p: any) => Promise<any> = createClientFetchProxy('job', 'hi') as any
  export const getMap: (kds: string[]) => Promise<any> = createClientFetchProxy('job', 'getMap') as any
export const getWordCloud: () => Promise<any> = createClientFetchProxy('job', 'getWordCloud') as any
  