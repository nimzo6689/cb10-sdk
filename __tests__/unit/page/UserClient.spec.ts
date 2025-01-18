import fs from 'fs';

import UserClient from '../../../src/page/user/UserClient';

describe('ユーザー名簿', () => {
  const userListIndexHtml = fs.readFileSync(`${__dirname}/../resources/page_UserListIndex.html`).toString();

  it('ユーザー名簿から取得するUIDリストが正しいこと', async () => {
    const CybozuTransportMock = jest.fn().mockImplementation(() => ({
      get: jest.fn().mockReturnValue(userListIndexHtml),
    }));
    const client = new UserClient(new CybozuTransportMock());

    const actual = await client.getMembers({ groupId: 13 });
    const expected = [
      { uID: 17, userName: '高橋 健太' },
      { uID: 27, userName: '加藤 美咲' },
      { uID: 208, userName: '大山 春香' },
    ];

    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });
});
