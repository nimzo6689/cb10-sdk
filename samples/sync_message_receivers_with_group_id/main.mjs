import { CybozuOffice } from 'cb10-sdk';

const client = new CybozuOffice({
  baseUrl: 'https://onlinedemo.cybozu.info/scripts/office10/ag.cgi',
  id: '17',
  password: '',
});

// 同期対象となるメッセージ
const targetMessage = {
  mDBID: 9,
  mDID: 4,
  eID: 300,
};

// メッセージの宛先を uID を取得
const currentReceiversUIDs = await client.message.getReceivers(targetMessage).then(r => r.map(it => it.uID));

// グループメンバーの uID を取得
const groupMembersUIDs = await client.user.getMembers({ groupId: 13 }).then(r => r.map(it => it.uID));

// 宛先とグループメンバーの uID を比較して、差分がないかを確認
const isSame =
  currentReceiversUIDs.size === groupMembersUIDs.size && currentReceiversUIDs.every(x => groupMembersUIDs.includes(x));

if (!isSame) {
  // 差分があれば、グループメンバーのみを宛先に含めるように変更
  await client.message.modifyReceivers({ ...targetMessage, uidList: groupMembersUIDs });
  console.log('メッセージの宛先をグループメンバーのみになるよう変更しました');
} else {
  console.log('メッセージの宛先に変更はありません');
}
