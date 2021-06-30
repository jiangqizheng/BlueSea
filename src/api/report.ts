
  import { createClientFetchProxy } from '../utils/fetch';

  
  
  export const hi: (p: any) => Promise<any> = createClientFetchProxy('report', 'hi') as any
  export const forRange: (mode: any) => any = createClientFetchProxy('report', 'forRange') as any
export const getTotalReport: ({ mode, }: { mode: "week" | "month" | "day" | "custom"; }) => Promise<any> = createClientFetchProxy('report', 'getTotalReport') as any
export const getMaterial: (range: any) => Promise<import("/Users/weidian/work/0629/tt-woxue/entity/Material").MaterialModel[]> = createClientFetchProxy('report', 'getMaterial') as any
export const getRawWord: (range: any) => Promise<import("/Users/weidian/work/0629/tt-woxue/entity/Word").WordModel[]> = createClientFetchProxy('report', 'getRawWord') as any
export const getChartReport: ({ mode, }: { mode: "week" | "month" | "day" | "custom"; }) => Promise<{ date: any; material: any; rawWord: any; }[]> = createClientFetchProxy('report', 'getChartReport') as any
  