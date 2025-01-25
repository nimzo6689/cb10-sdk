import { AxiosAdapter, AxiosRequestConfig } from 'axios';
import { CybozuOffice } from '../src/index';
import { CybozuOfficeSDKException } from '../src/common/Errors';
import { needsLoginCB10Options, fileAddHtml, error10101Html, normalResponse } from './utils';

describe('ログイン', () => {
  it('セッションなしの状態からログインを実行', async () => {
    const adapter: AxiosAdapter = function (config: AxiosRequestConfig) {
      const body = new URLSearchParams(config.data);
      if (config?.headers?.Cookie !== 'AGSESSID=6e85000b30625dba981127762ce00c9fb25b0419a8febfda') {
        // ログイン済みでない場合
        if (
          body.get('_System') === 'login' &&
          body.get('_Login') === '1' &&
          body.get('Password') === 'password' &&
          body.get('_ID') === 'username'
        ) {
          return new Promise(resolve =>
            resolve({
              ...normalResponse,
              status: 302,
              headers: {
                'set-cookie': [
                  'AGSESSID=6e85000b30625dba981127762ce00c9fb25b0419a8febfda; path=/scripts/office10/; secure; HttpOnly',
                  'AGLOGINID=17; expires=Thu, 23-Jan-2025 14:20:07 GMT; path=/scripts/office10/; secure',
                ],
                'x-cybozu-user': '17',
              },
              data: '',
            })
          );
        }
        return new Promise((_, reject) => reject(new Error(`Not Found`)));
      } else if (config?.headers?.Cookie === 'AGSESSID=6e85000b30625dba981127762ce00c9fb25b0419a8febfda') {
        // ログイン済みの場合
        if (config?.params?.get('page') === 'FileAdd') {
          return new Promise(resolve => resolve({ ...normalResponse, data: fileAddHtml }));
        }
        if (body.get('page') === 'FileAdd') {
          return new Promise(resolve => resolve({ ...normalResponse, data: '' }));
        }
      }
      throw new Error(`Unknown request.`);
    };
    const client = new CybozuOffice({ ...needsLoginCB10Options, axiosRequestConfig: { adapter } });

    let _ = await client.transport.post({ page: 'FileAdd' });
    expect(client.transport.sessionCredentials?.cookie).toBe(
      'AGSESSID=6e85000b30625dba981127762ce00c9fb25b0419a8febfda'
    );
    expect(client.transport.sessionCredentials?.myOwnUID).toBe(17);
    expect(client.transport.sessionCredentials?.csrfTicket).toBe('9003b2751bdbd00fc31225b9bdc736b8');
  });

  it('パスワード不備でログインを実施', async () => {
    const adapter: AxiosAdapter = function (config: AxiosRequestConfig) {
      const body = new URLSearchParams(config.data);
      if (config?.headers?.Cookie !== 'AGSESSID=6e85000b30625dba981127762ce00c9fb25b0419a8febfda') {
        // ログイン済みでない場合
        if (
          body.get('_System') === 'login' &&
          body.get('_Login') === '1' &&
          body.get('Password') !== 'password' &&
          body.get('_ID') === 'username'
        ) {
          return new Promise(resolve =>
            resolve({
              ...normalResponse,
              status: 200,
              headers: {
                'x-cybozu-error': '10101',
                'x-cybozulogin': '1',
              },
              data: error10101Html,
            })
          );
        }
        return new Promise((_, reject) => reject(new Error(`Not Found`)));
      }
      throw new Error(`Unknown request.`);
    };
    const client = new CybozuOffice({
      ...{ ...needsLoginCB10Options, password: 'failed' },
      axiosRequestConfig: { adapter },
    });

    await expect(async () => {
      await client.transport.post({ page: 'FileAdd' });
    }).rejects.toThrow(CybozuOfficeSDKException);
  });

  it('古いセッション情報でログインを実行', async () => {
    const adapter: AxiosAdapter = function (config: AxiosRequestConfig) {
      const body = new URLSearchParams(config.data);
      if (config?.headers?.Cookie !== 'AGSESSID=6e85000b30625dba981127762ce00c9fb25b0419a8febfda') {
        // ログイン済みでない場合
        if (
          body.get('_System') === 'login' &&
          body.get('_Login') === '1' &&
          body.get('Password') === 'password' &&
          body.get('_ID') === 'username'
        ) {
          return new Promise(resolve =>
            resolve({
              ...normalResponse,
              status: 302,
              headers: {
                'set-cookie': [
                  'AGSESSID=6e85000b30625dba981127762ce00c9fb25b0419a8febfda; path=/scripts/office10/; secure; HttpOnly',
                  'AGLOGINID=17; expires=Thu, 23-Jan-2025 14:20:07 GMT; path=/scripts/office10/; secure',
                ],
                'x-cybozu-user': '17',
              },
              data: '',
            })
          );
        } else {
          return new Promise(resolve =>
            resolve({
              ...normalResponse,
              status: 200,
              headers: {
                'x-cybozulogin': '1',
              },
              data: error10101Html,
            })
          );
        }
      } else if (config?.headers?.Cookie === 'AGSESSID=6e85000b30625dba981127762ce00c9fb25b0419a8febfda') {
        // ログイン済みの場合
        if (config?.params?.get('page') === 'FileAdd') {
          return new Promise(resolve => resolve({ ...normalResponse, data: fileAddHtml }));
        }
        if (body.get('page') === 'FileAdd') {
          return new Promise(resolve => resolve({ ...normalResponse, data: '' }));
        }
      }
      throw new Error(`Unknown request.`);
    };
    const client = new CybozuOffice({
      ...{
        ...needsLoginCB10Options,
        sessionCredentials: {
          cookie: 'AGSESSID=old_session',
          myOwnUID: 17,
          csrfTicket: 'old_csrf',
        },
      },
      axiosRequestConfig: { adapter },
    });

    let _ = await client.transport.post({ page: 'FileAdd' });
    expect(client.transport.sessionCredentials?.cookie).toBe(
      'AGSESSID=6e85000b30625dba981127762ce00c9fb25b0419a8febfda'
    );
    expect(client.transport.sessionCredentials?.myOwnUID).toBe(17);
    expect(client.transport.sessionCredentials?.csrfTicket).toBe('9003b2751bdbd00fc31225b9bdc736b8');
  });
});
