import { AxiosAdapter, AxiosRequestConfig } from 'axios';
import { CybozuOffice } from '../../../src/index';
import { defaultCB10Options, myFolderMessageViewHtml, normalResponse } from '../utils';

describe('メッセージ', () => {
  it('メッセージの送信', async () => {
    const adapter: AxiosAdapter = function (config: AxiosRequestConfig) {
      const body = new URLSearchParams(config.data);
      if (body.get('page') === 'MyFolderMessageSend') {
        return new Promise(resolve => resolve({ ...normalResponse, data: '' }));
      }
      throw new Error(`Unknown request.`);
    };
    const client = new CybozuOffice({ ...defaultCB10Options, axiosRequestConfig: { adapter } });

    const actual = await client.message.sendMessage({
      subject: 'タイトル',
      data: '本文',
      uidList: [1],
      group: 'グループ',
      editableByReceivers: 1,
      useConfirm: 0,
      simpleReplyEnable: 1,
    });
    expect(actual).toBeUndefined();
  });

  it('メッセージのコメントが取得できるか', async () => {
    const adapter: AxiosAdapter = function (config: AxiosRequestConfig) {
      if (config.params.get('page') === 'AjaxMyFolderMessageFollowNavi') {
        return new Promise(resolve => resolve({ ...normalResponse, data: myFolderMessageViewHtml }));
      }
      throw new Error(`Unknown request.`);
    };
    const client = new CybozuOffice({ ...defaultCB10Options, axiosRequestConfig: { adapter } });

    const actual = await client.message.getComments({ mDBID: 4, mDID: 4 });
    const expected = [
      {
        followId: 24,
        userName: '和田 一夫',
        attachedFile: undefined,
        attachedQuery: undefined,
      },
      {
        followId: 21,
        userName: '大山 春香',
        attachedFile:
          '%E8%A9%A6%E9%A8%93%E7%94%A8%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB(%E5%A4%A7%E5%B1%B1%E6%98%A5%E9%A6%99).txt',
        attachedQuery: {
          page: 'FileDownload',
          id: '1712074',
          mDBID: '7',
          mEID: '85',
          mDID: '313440',
          notimecard: '1',
          type: 'text',
          subtype: 'plain',
          ct: '1',
          ext: '.txt',
        },
      },
      {
        followId: 17,
        userName: '加藤 美咲',
        attachedFile: undefined,
        attachedQuery: undefined,
      },
    ];

    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });

  it('宛先リストを取得する', async () => {
    const adapter: AxiosAdapter = function (config: AxiosRequestConfig) {
      if (config.params.get('page') === 'MyFolderMessageReceiverAdd') {
        return new Promise(resolve => resolve({ ...normalResponse, data: myFolderMessageViewHtml }));
      }
      throw new Error(`Unknown request.`);
    };
    const client = new CybozuOffice({ ...defaultCB10Options, axiosRequestConfig: { adapter } });

    const actual = await client.message.getReceivers({ mDBID: 4, mDID: 4, eID: 782 });
    const expected: never[] = [];

    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });
});
