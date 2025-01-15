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
    actual = await client.message.getReceivers({ mDBID: 9, mDID: 4, eID: 300 });
    const expectedExistingReceivers = [
      { uID: 17, userName: '高橋 健太' },
      { uID: 23, userName: '和田 一夫' },
      { uID: 27, userName: '加藤 美咲' },
    ];
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expectedExistingReceivers));

    // グループメンバーを取得
    actual = await client.user.getMembers({ groupId: 13 });
    const expectedGroupMembers = [
      { uID: 17, userName: '高橋 健太' },
      { uID: 27, userName: '加藤 美咲' },
      { uID: 208, userName: '大山 春香' },
    ];
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expectedGroupMembers));

    // グループメンバーのみを宛先に含めるように変更
    const receivers = actual.map((it: any) => it.uID);
    await client.message.modifyReceivers({ mDBID: 9, mDID: 4, eID: 300, uidList: receivers });
    actual = await client.message.getReceivers({ mDBID: 9, mDID: 4, eID: 300 });
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expectedGroupMembers));
  });
});
