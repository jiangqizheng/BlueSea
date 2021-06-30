
  import { createClientFetchProxy } from '../utils/fetch';

  
  type youdaoWord = {
  returnPhrase: string[];
  query: string;
  errorCode: string;
  l: string;
  tSpeakUrl: string;
  web: { value: string[]; key: string }[];
  requestId: string;
  translation: string[];
  dict: { url: string };
  webdict: { url: string };
  basic: {
    exam_type: string[];
    'us-phonetic': string;
    phonetic: string;
    'uk-phonetic': string;
    wfs: { wf: { name: string; value: string } }[];
    'uk-speech': string;
    explains: string[];
    'us-speech': string;
  };
  isWord: Boolean;
  speakUrl: string;
};
type youdaoSentence = {
  tSpeakUrl: string;
  requestId: string;
  query: string;
  translation: string[];
  errorCode: string;
  dict: {
    url: string;
  };
  webdict: {
    url: string;
  };
  l: string;
  isWord: Boolean;
  speakUrl: string;
};
type BaseDict = {
  id: number;
  word: string;
  sw: string;
  phonetic: string;
  definition: string;
  translation: string;
  pos: string;
  collins: number;
  oxford: number;
  tag: string;
  bnc: number;
  frq: number;
  exchange: string;
  detail: string;
};
type queryDt = {
  // id?: number; //自动根据单词或者句子来查信息
  // youdao: Boolean
  text: string;
};
type queryRt = {
  query: string;
  translation: string; // 从dict中提取，一定有结果
  dict?: Dict; // 单词时存在
  material?: Material; //当前单词或句子已收藏时
};
type Material = {
  id: number;
};
type Dict = {
  phonetic: string;
};
  export const hi: (p: any) => Promise<any> = createClientFetchProxy('fy', 'hi') as any
  export const query: (dt: queryDt) => Promise<queryRt> = createClientFetchProxy('fy', 'query') as any
export const forDictWord: (word: string) => Promise<{ word: any; phonetic: any; translation: any; }> = createClientFetchProxy('fy', 'forDictWord') as any
export const queryWord: (text: string) => Promise<{ dictWord: any; userWord: any; }> = createClientFetchProxy('fy', 'queryWord') as any
export const query2: (text: string) => Promise<{ queryText: string; translation: string; wordList: { text: any; dict: any; }[]; }> = createClientFetchProxy('fy', 'query2') as any
export const addYoudaoCache: (query: any, content: any) => Promise<void> = createClientFetchProxy('fy', 'addYoudaoCache') as any
export const queryYoudaoCache: (query: any) => Promise<any> = createClientFetchProxy('fy', 'queryYoudaoCache') as any
export const youdaoFy: (query: string) => Promise<youdaoWord | youdaoSentence> = createClientFetchProxy('fy', 'youdaoFy') as any
export const addQueryHistory: (query: string) => Promise<void> = createClientFetchProxy('fy', 'addQueryHistory') as any
export const getQueryHistoryList: () => Promise<any[]> = createClientFetchProxy('fy', 'getQueryHistoryList') as any
export const getTodayHotList: () => Promise<any[]> = createClientFetchProxy('fy', 'getTodayHotList') as any
export const delQueryHistoryList: (id: number) => Promise<void> = createClientFetchProxy('fy', 'delQueryHistoryList') as any
export const forWordWithExchange: (wordText: any) => Promise<any> = createClientFetchProxy('fy', 'forWordWithExchange') as any
  