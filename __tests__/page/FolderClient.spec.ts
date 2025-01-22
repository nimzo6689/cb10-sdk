import { AxiosAdapter, AxiosRequestConfig } from 'axios';
import { CybozuOffice } from '../../src/index';
import { defaultCB10Options, myFolderIndexHtml, normalResponse } from '../utils';

describe('個人フォルダ', () => {
  it('個人フォルダ（受信箱）から取得できるか(Mock不使用)', async () => {
    const adapter: AxiosAdapter = function (config: AxiosRequestConfig) {
      if (config.params.get('page') === 'MyFolderIndex' && config.params.get('FID') === 'inbox') {
        return new Promise(resolve => resolve({ ...normalResponse, data: myFolderIndexHtml }));
      }
      throw new Error(`Unknown request.`);
    };
    const client = new CybozuOffice({ ...defaultCB10Options, axiosRequestConfig: { adapter } });

    const actual = await client.folder.getMessages({ folderId: 'inbox' });

    const expected = [
      { mDBID: 2, mDID: 4, subject: 'try' },
      { mDBID: 4, mDID: 4, subject: '【講読自由】総務からのお知らせ' },
      { mDBID: 5, mDID: 4, subject: '【連絡帳】営業部 ⇔ 総務部' },
      { mDBID: null, mDID: 4, subject: '【回覧板】『電話メモ』の利用について' },
      { mDBID: null, mDID: 33, subject: '【連絡帳】営業部 ⇔ 総務部' },
    ];

    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });
});
