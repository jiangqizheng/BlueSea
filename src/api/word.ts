
  import { createClientFetchProxy } from '../utils/fetch';

  interface Word {
  id: number;
  text: string;
  translation: string;
  phonetic: string; // 取自有道
  desc: number;
  lemma: string; // 原型，可能存在
  // dict: {
  //   [key: string]: any;
  // };
  // extend: {
  //   [key: string]: any;
  // };
}
interface FilterQuery {
  stateArr: number[]; // 单词状态
  tagArr: string[];
  collinsArr: number[];
  sortRule: string; // 1 2 3 4
  oxford: boolean; //牛津3000
  nosimple: boolean; //非简单词
  lemma: boolean; //单词原型
  stoped: boolean;
  collected: boolean;
}
  
  export const hi: (p: any) => Promise<any> = createClientFetchProxy('word', 'hi') as any
  export const load: (dt: any) => Promise<any> = createClientFetchProxy('word', 'load') as any
export const forOneWord: (word: { id: number; text: string; translation: string; }, { youdaoObj, dictObj, lemmaObj, bookObj, rawLemmaObj }: any) => { id: number; text: string; translation: string; phonetic: any; youdao: any; dict: any; lemma: any; } = createClientFetchProxy('word', 'forOneWord') as any
export const getObjs: (texts: any, opt: any) => Promise<{ youdaoObj: {}; lemmaObj: {}; bookObj: any; dictObj: {}; rawLemmaObj: any; }> = createClientFetchProxy('word', 'getObjs') as any
export const getWords: (words: any, opt?: {}) => Promise<any> = createClientFetchProxy('word', 'getWords') as any
export const getDictWordList: (filter: FilterQuery) => Promise<any> = createClientFetchProxy('word', 'getDictWordList') as any
export const getWordList: (filter: FilterQuery) => Promise<any> = createClientFetchProxy('word', 'getWordList') as any
export const batchAddWord: (texts: string[]) => Promise<void> = createClientFetchProxy('word', 'batchAddWord') as any
export const addStopList: (text: any) => Promise<void> = createClientFetchProxy('word', 'addStopList') as any
export const getStopList: () => Promise<string[]> = createClientFetchProxy('word', 'getStopList') as any
export const updateStopList: (stopList: string) => Promise<void> = createClientFetchProxy('word', 'updateStopList') as any
  