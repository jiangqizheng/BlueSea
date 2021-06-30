
  import { createClientFetchProxy } from '../utils/fetch';

  interface MaterialDto {
  id: number;
  uid: number;
  content: string;
  comment: string;
  is_word: 0 | 1; // 0否 1是
  mtime: string;
  ctime: string;
}
interface MaterialUpdateDto {
  id?: number;
  content?: string;
  comment?: string;
}
interface It extends MaterialDto {
  tags: Tag[];
}
  type queryRt = {
  id?: number;
  text: string;
  translation: string; // 从dict中提取，一定有结果
  dict?: Dict; // 单词时存在
  material?: MaterialDto; //当前单词或句子已收藏时
};
type Dict = {
  phonetic: string;
};
type TagRs = {
  id: number;
  material_id: number;
  tag_id: number;
};
type Tag = {
  id: number;
  uid: number;
  content: string;
  comment: string;
};
  export const hi: (p: any) => Promise<any> = createClientFetchProxy('material', 'hi') as any
  export const load: (dt: any) => Promise<any> = createClientFetchProxy('material', 'load') as any
export const translation: (text: string) => Promise<{ query: string; translation: string; isWord: Boolean; phonetic: string; _extends: youdaoWord; }> = createClientFetchProxy('material', 'translation') as any
export const batchAddWord: (texts: string[]) => Promise<void> = createClientFetchProxy('material', 'batchAddWord') as any
export const getWordList: ({ stateList }: { stateList: number[]; }) => Promise<import("/Users/weidian/work/0629/tt-woxue/entity/Word").WordModel[]> = createClientFetchProxy('material', 'getWordList') as any
export const del: (id: number) => Promise<void> = createClientFetchProxy('material', 'del') as any
export const delMaterialHistory: (id: number) => Promise<void> = createClientFetchProxy('material', 'delMaterialHistory') as any
export const getMaterialHistoryList: () => Promise<import("/Users/weidian/work/0629/tt-woxue/entity/MaterialHistory").MaterialHistoryModel[]> = createClientFetchProxy('material', 'getMaterialHistoryList') as any
export const addMaterialHistory: (text: string) => Promise<import("/Users/weidian/work/0629/tt-woxue/entity/MaterialHistory").MaterialHistoryModel> = createClientFetchProxy('material', 'addMaterialHistory') as any
export const firstAdd: (m: import("/Users/weidian/work/0629/tt-woxue/entity/MaterialHistory").MaterialHistoryModel & { raw_words: string; reason: string; }) => Promise<import("/Users/weidian/work/0629/tt-woxue/entity/Material").MaterialModel> = createClientFetchProxy('material', 'firstAdd') as any
export const update: (dt: import("/Users/weidian/work/0629/tt-woxue/entity/Material").MaterialModel) => Promise<void> = createClientFetchProxy('material', 'update') as any
export const addOneRawWord: (m: import("/Users/weidian/work/0629/tt-woxue/entity/MaterialHistory").MaterialHistoryModel) => Promise<void> = createClientFetchProxy('material', 'addOneRawWord') as any
export const addRawWords: ({ material_id, words, }: { material_id: number; words: string[]; }) => Promise<void> = createClientFetchProxy('material', 'addRawWords') as any
export const getMaterialList: ({ tagId }: { tagId: any; }) => Promise<{ tags: any[]; id: number; uid: number; content: string; comment: string; is_word: 0 | 1; mtime: string; ctime: string; }[]> = createClientFetchProxy('material', 'getMaterialList') as any
export const getList: (body: { stages: number[]; }) => Promise<import("/Users/weidian/work/0629/tt-woxue/entity/Material").MaterialModel[]> = createClientFetchProxy('material', 'getList') as any
export const batchQuery: (materials: MaterialDto[]) => Promise<queryRt[]> = createClientFetchProxy('material', 'batchQuery') as any
export const query: (text: string) => Promise<queryRt> = createClientFetchProxy('material', 'query') as any
  