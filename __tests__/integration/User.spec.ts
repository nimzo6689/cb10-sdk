import { CybozuOffice } from '../../src/index';

describe('[結合テスト]ユーザー名簿', () => {
  let client: CybozuOffice;

  beforeAll(() => {
    client = new CybozuOffice({
      baseUrl: 'https://onlinedemo.cybozu.info/scripts/office10/ag.cgi',
      id: '17',
      password: '',
    });
  });

  afterEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 1_000));
  });

  it('[結合テスト]ユーザー名簿から取得するUIDリストが正しいこと', async () => {
    const actual = await client.user.getGroupMembers({ groupId: 13 });
    const expected = [
      { uID: 17, userName: '高橋 健太' },
      { uID: 27, userName: '加藤 美咲' },
      { uID: 208, userName: '大山 春香' },
    ];

    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });
});
