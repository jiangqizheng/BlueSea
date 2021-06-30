
  import { createClientFetchProxy } from '../utils/fetch';

  interface userLoginBody {
  identity_type: 'email' | 'phone' | 'game';
  identifier: string;
  credential: string;
  LOGIN_TOKEN?: string;
}
  
  export const hi: (p: any) => Promise<any> = createClientFetchProxy('user', 'hi') as any
  export const forA: () => Promise<void> = createClientFetchProxy('user', 'forA') as any
export const userLogin: (body: userLoginBody) => Promise<{ LOGIN_TOKEN: string; }> = createClientFetchProxy('user', 'userLogin') as any
export const logout: () => Promise<void> = createClientFetchProxy('user', 'logout') as any
export const userInfo: () => Promise<{ LOGIN_TOKEN: any; uid: number; email: string; nickname: string; ctime: string; mtime: string; }> = createClientFetchProxy('user', 'userInfo') as any
export const updateUserInfo: ({ nickname }: { nickname: string; }) => Promise<import("/Users/weidian/work/0629/tt-woxue/node_modules/mysql2/typings/mysql/lib/protocol/packets/RowDataPacket")[] | import("/Users/weidian/work/0629/tt-woxue/node_modules/mysql2/typings/mysql/lib/protocol/packets/RowDataPacket")[][] | import("/Users/weidian/work/0629/tt-woxue/node_modules/mysql2/typings/mysql/lib/protocol/packets/OkPacket") | import("/Users/weidian/work/0629/tt-woxue/node_modules/mysql2/typings/mysql/lib/protocol/packets/OkPacket")[] | import("/Users/weidian/work/0629/tt-woxue/node_modules/mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader")> = createClientFetchProxy('user', 'updateUserInfo') as any
export const forUser: () => Promise<{ LOGIN_TOKEN: any; uid: number; email: string; nickname: string; ctime: string; mtime: string; }> = createClientFetchProxy('user', 'forUser') as any
export const verify: (body: userLoginBody) => Promise<any> = createClientFetchProxy('user', 'verify') as any
export const createUser: (body: userLoginBody) => Promise<any> = createClientFetchProxy('user', 'createUser') as any
export const createGameUser: (body: userLoginBody) => Promise<any> = createClientFetchProxy('user', 'createGameUser') as any
export const bindEmail: ({ email, password }: { email: string; password: string; }) => Promise<string> = createClientFetchProxy('user', 'bindEmail') as any
export const getAuths: () => Promise<any[]> = createClientFetchProxy('user', 'getAuths') as any
  