import { AxiosAdapter, AxiosRequestConfig } from 'axios';
import { CybozuOffice } from '../../src/index';
import { defaultCB10Options, userListIndexHtml, normalResponse } from '../utils';

describe('ユーザー名簿', () => {
  it('ユーザー名簿から取得するUIDリストが正しいこと', async () => {
    const adapter: AxiosAdapter = function (config: AxiosRequestConfig) {
      if (config.params.get('page') === 'UserListIndex') {
        return new Promise(resolve => resolve({ ...normalResponse, data: userListIndexHtml }));
      }
      throw new Error(`Unknown request.`);
    };
    const client = new CybozuOffice({ ...defaultCB10Options, axiosRequestConfig: { adapter } });

    const actual = await client.user.getMembers({ groupId: 13 });
    const expected = [
      { uID: 17, userName: '高橋 健太' },
      { uID: 27, userName: '加藤 美咲' },
      { uID: 208, userName: '大山 春香' },
    ];

    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });
});
