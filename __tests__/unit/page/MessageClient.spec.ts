import fs from 'fs';

import MessageClient from '../../../src/page/message/MessageClient';

describe('メッセージ', () => {
  const page_MyFolderMessageView_rawContent = fs
    .readFileSync(`${__dirname}/../resources/page_MyFolderMessageView.rawContent`)
    .toString();

  it('メッセージの送信', async () => {
    const CybozuTransportMock = jest.fn().mockImplementation(() => {
      return {
        post: (x = '') => {},
      };
    });
    const client = new MessageClient(new CybozuTransportMock());

    const actual = await client.sendMessage({
      subject: 'タイトル',
      data: '本文',
      uidList: [1],
      group: 'グループ',
      editableByReceivers: 1,
      useConfirm: 0,
      simpleReplyEnable: 1,
    });

    expect(actual).toEqual(true);
  });

  it('メッセージのコメントが取得できるか', async () => {
    const CybozuTransportMock = jest.fn().mockImplementation(() => {
      return {
        get: (x = '') => {
          return page_MyFolderMessageView_rawContent;
        },
      };
    });
    const client = new MessageClient(new CybozuTransportMock());

    const actual = await client.getComments(4, 4);
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
    const CybozuTransportMock = jest.fn().mockImplementation(() => {
      return {
        get: (x = '') => {
          return page_MyFolderMessageView_rawContent;
        },
      };
    });
    const client = new MessageClient(new CybozuTransportMock());

    const actual = await client.getReceivers(4, 4, 782);
    const expected: never[] = [];

    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });
});
