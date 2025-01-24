import { AxiosAdapter, AxiosRequestConfig } from 'axios';
import { CybozuOffice } from '../../src/index';
import { CybozuOfficeSDKException } from '../../src/common/Errors';
import { defaultCB10Options, notificationIndexHtml, normalResponse } from '../utils';

describe('通知一覧', () => {
  it('メッセージが取得できること', async () => {
    const adapter: AxiosAdapter = function (config: AxiosRequestConfig) {
      if (config.params.get('page') === 'NotificationIndex') {
        return new Promise(resolve => resolve({ ...normalResponse, data: notificationIndexHtml }));
      }
      throw new Error(`Unknown request.`);
    };
    const client = new CybozuOffice({ ...defaultCB10Options, axiosRequestConfig: { adapter } });

    const actual = await client.notification.getContents({ kind: 'unread' });
    const expected = [
      {
        mDBID: 5,
        mDID: 4,
        body: {
          subject: '【連絡帳】営業部 ⇔ 総務部',
          content:
            '部署間での情報交換、意見交換をするメッセージです。ag.cgi?Page=DBTotalingView&DID=116&VID=69&Prev=DBView&QID=all&TID=291#inline',
        },
        comments: [
          {
            followId: 16,
            createdBy: '和田 一夫',
            createdAt: '2015/10/8(木) 13:44',
            content: '「サイボウズ Office」を200ユーザーで受注しました。今月も頑張っていきます！',
            hasUpdated: true,
          },
          {
            followId: 14,
            createdBy: '高橋 健太',
            createdAt: '2015/10/8(木) 11:39',
            content: '予算を達成できるように、今月も頑張っていきましょう。',
            hasUpdated: false,
          },
        ],
      },
      {
        mDBID: 4,
        mDID: 4,
        body: {
          subject: '【講読自由】総務からのお知らせ',
          content: '【講読自由】総務からのお知らせをこちらに掲示していきます。',
        },
        comments: [
          {
            followId: 11,
            createdBy: '大山 春香',
            createdAt: '2015/10/8(木) 13:03',
            content:
              '名刺の発注をする際に、裏面のデザインを選択していない方が多数見受けられます。裏面のデザインが選択してあることを確認してから、発注ボタンを押すようにお願いします！',
            hasUpdated: true,
          },
        ],
      },
    ];

    expect(JSON.stringify(actual.messages)).toBe(JSON.stringify(expected));
  });

  it('既読一覧の取得不可', async () => {
    const client = new CybozuOffice({ ...defaultCB10Options });
    await expect(async () => {
      await client.notification.getContents({ kind: 'read' });
    }).rejects.toThrow(CybozuOfficeSDKException);
  });
});
