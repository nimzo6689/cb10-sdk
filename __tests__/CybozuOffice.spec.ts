import fs from 'fs';
import { AxiosAdapter, AxiosRequestConfig } from 'axios';

import { CybozuOffice } from '../src/index';

const fileAddHtml = fs.readFileSync(`${__dirname}/resources/page_FileAdd`).toString();

const normalResponse = {
  status: 200,
  statusText: 'OK',
  headers: {} as any,
  config: {} as any,
};

const defaultCB10Options = {
  baseUrl: 'https://onlinedemo.cybozu.info/scripts/office10/ag.cgi',
  id: 'username',
  password: 'password',
};

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

  return new Promise((_, reject) => reject(new Error(`Not Found in axios adapter`)));
};

describe('ログイン', () => {
  let client: CybozuOffice;
  beforeAll(() => {
    client = new CybozuOffice({ ...defaultCB10Options, axiosRequestConfig: { adapter } });
  });

  it('個人フォルダ（受信箱）から取得できるか(Mock不使用)', async () => {
    let _ = await client.transport.post({ page: 'FileAdd' });
    client.transport.sessionCredentials?.cookie === 'AGSESSID=6e85000b30625dba981127762ce00c9fb25b0419a8febfda';
    client.transport.sessionCredentials?.csrfTicket === '9003b2751bdbd00fc31225b9bdc736b8';
  });
});
