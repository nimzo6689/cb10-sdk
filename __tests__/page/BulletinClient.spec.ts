import { AxiosAdapter, AxiosRequestConfig } from 'axios';
import { CybozuOffice } from '../../src/index';
import { defaultCB10Options, normalResponse } from '../utils';

describe('掲示板', () => {
  it('コメントの送信', async () => {
    const adapter: AxiosAdapter = function (config: AxiosRequestConfig) {
      const body = new URLSearchParams(config.data);
      if (body.get('page') === 'AjaxBulletinFollowAdd') {
        return new Promise(resolve => resolve({ ...normalResponse, data: '' }));
      }
      throw new Error(`Unknown request.`);
    };
    const client = new CybozuOffice({ ...defaultCB10Options, axiosRequestConfig: { adapter } });

    const actual = await client.bulletin.sendComment({
      bid: 4,
      data: 'コメント',
    });
    expect(actual).toBeUndefined();
  });
});
