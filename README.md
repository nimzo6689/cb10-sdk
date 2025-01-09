# cb10-sdk

[![npm version](https://badge.fury.io/js/cb10-sdk.svg)](https://badge.fury.io/js/cb10-sdk)
[![testings](https://github.com/nimzo6689/cb10-sdk/actions/workflows/ci.yaml/badge.svg)](https://github.com/nimzo6689/cb10-sdk/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/nimzo6689/cb10-sdk/graph/badge.svg?token=UMKvjV7TKf)](https://codecov.io/gh/nimzo6689/cb10-sdk)

Node.js で利用できるサイボウズ Office 10 用の SDK です。

## 基本的な使い方

基本的な使用例はこちらです。

```js
const client = new CybozuOffice({
  baseUrl: 'https://onlinedemo.cybozu.info/scripts/office10/ag.cgi',
  id: '17',
  password: '',
});

// グループ ID が 13（総務部）のユーザ一覧を取得
const groupMembers = await client.getGroupMembers({ groupId: 13 });
groupMembers.forEach(it => JSON.stringify(it));
// { uID: 17, userName: '高橋 健太' }
// { uID: 27, userName: '加藤 美咲' }
// { uID: 208, userName: '大山 春香' }
```

より詳細な使い方については [**tests**](https://github.com/nimzo6689/cb10-sdk/tree/main/__tests__) 配下のテストコードをご参照ください。

### 補足：ログイン方法について

サイボウズへのログインする際に、ユーザをプルダウンではなく、フォーム入力となっている場合、以下のような実装になります。

```js
const client = new CybozuOffice({
  baseUrl: 'https://your-cybozu-office-site/xxxx/xxxx/ag.cgi',
  accountId: 'hoge',
  password: 'hogehoge',
});
```
