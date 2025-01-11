import { CybozuOffice } from '../../../src/index';

describe('[シナリオテスト]特定のグループに所属するメンバーのみを宛先に含めるように変更する', () => {
  let client: CybozuOffice;

  beforeAll(() => {
    client = new CybozuOffice({
      baseUrl: 'https://onlinedemo.cybozu.info/scripts/office10/ag.cgi',
      id: '17',
      password: '',
    });
  });

  it('[シナリオテスト]特定のグループに所属するメンバーのみを宛先に含めるように変更する', async () => {
    let actual: any;
    // メッセージの宛先を取得
    actual = await client.message.getReceivers(9, 4, 300);
    const expectedExistingReceivers = [
      { uID: 17, userName: '高橋 健太' },
      { uID: 23, userName: '和田 一夫' },
      { uID: 27, userName: '加藤 美咲' },
    ];
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expectedExistingReceivers));

    // グループメンバーを取得
    actual = await client.user.getGroupMembers({ groupId: 13 });
    const expectedGroupMembers = [
      { uID: 17, userName: '高橋 健太' },
      { uID: 27, userName: '加藤 美咲' },
      { uID: 208, userName: '大山 春香' },
    ];
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expectedGroupMembers));

    // グループメンバーのみを宛先に含めるように変更
    const receivers = actual.map((it: any) => it.uID);
    await client.message.modifyReceivers(9, 4, 300, receivers);
    actual = await client.message.getReceivers(9, 4, 300);
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expectedGroupMembers));
  });
});
