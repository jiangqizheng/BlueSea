
  import { createClientFetchProxy } from '../utils/fetch';

  interface userLoginBody {
  identity_type: 'email' | 'phone';
  identifier: string;
  credential: string;
}
  
  export const hi: (p: any) => Promise<any> = createClientFetchProxy('auth', 'hi') as any
  export const login: (body: userLoginBody) => Promise<void> = createClientFetchProxy('auth', 'login') as any
export const logout: () => Promise<void> = createClientFetchProxy('auth', 'logout') as any
export const verify: (body: userLoginBody) => Promise<any> = createClientFetchProxy('auth', 'verify') as any
export const createUser: (body: userLoginBody) => Promise<any> = createClientFetchProxy('auth', 'createUser') as any
  