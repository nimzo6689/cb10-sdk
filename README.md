# cb10-sdk

[![npm version](https://badge.fury.io/js/cb10-sdk.svg)](https://badge.fury.io/js/cb10-sdk)
[![testings](https://github.com/nimzo6689/cb10-sdk/actions/workflows/ci.yaml/badge.svg)](https://github.com/nimzo6689/cb10-sdk/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/nimzo6689/cb10-sdk/graph/badge.svg?token=UMKvjV7TKf)](https://codecov.io/gh/nimzo6689/cb10-sdk)

cb10-sdk とは、 Node.js にてパッケージ版の [サイボウス Office 10](https://office.cybozu.co.jp/price/on-premise/ver10user/) へのメッセージ投稿や宛先更新、個人フォルダへの仕分け作業ができるツールです。  
cb10-sdk を使うことで、普段のサイボウズ上での作業を自動化することに役立てることができます。

## ご利用の前に

以前は サイボウズ Office 10 向けに SOAP API が提供されていましたが、2018年9⽉28⽇をもって新規での利用ができないようにされているため、cb10-sdk では HTML のスクレイピングにてデータ取得などを実現しています。

[「サイボウズ Office」連携APIドキュメント配布終了のお知らせ (2018/09/19)](https://developer.cybozu.io/hc/ja/articles/360015228332--%E3%82%B5%E3%82%A4%E3%83%9C%E3%82%A6%E3%82%BA-Office-%E9%80%A3%E6%90%BAAPI%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88%E9%85%8D%E5%B8%83%E7%B5%82%E4%BA%86%E3%81%AE%E3%81%8A%E7%9F%A5%E3%82%89%E3%81%9B-2018-09-19-)

ちなみに API での連携に興味がある場合は、 [Garoon](https://garoon.cybozu.co.jp/) や [kintone](https://kintone.cybozu.co.jp/) を検討してみてもいいと思います。

## 導入方法について

### 1. 事前準備

cb10-sdk を使うには Node.js 20 以上が必要です。
Node.js をはじめて使う場合はインストールする必要があります。

### 2. cb10-sdk をインストールする

package.json があるディレクトリで、以下のコマンドを実行します。

```bash
npm install cb10-sdk
```

### 3. cb10-sdk をアップデートする

アップデートする場合は以下のコマンドを実行します。

```bash
npm install cb10-sdk@latest
```

## 使用方法について

実装例はこちらです。

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

サイボウズへのログインする際に、ユーザをプルダウンではなくフォーム入力となっている場合、以下のような実装になります。

```js
const client = new CybozuOffice({
  baseUrl: 'https://your-cybozu-office-site/xxxx/xxxx/ag.cgi',
  accountId: 'hoge',
  password: 'hogehoge',
});
```

### 補足：SSL 認証を無効化したい

サイボウズ Office への通信時に SSL 証明書が無効化されていたり、 IP アドレス指定で通信したい場合は、 `disableSslVerification` を `true` に指定いただくことで認証を無効化できます。

```js
const client = new CybozuOffice({
  baseUrl: 'https://192.168.0.1/xxxx/xxxx/ag.cgi',
  accountId: 'hoge',
  password: 'hogehoge',
  disableSslVerification: true,
});
```

### 補足：タイムアウトの時間を設定したい

cb10-sdk では HTTP 通信をする際に [axios](https://axios-http.com/) を使用しており、 `CybozuOffice` のコンストラクタにて、 Request Config のオブジェクトを渡すことで、タイムアウトの時間を設定することができます。  
他にも、 BASIC 認証や Proxy も設定いただけます。

```js
import { AxiosRequestConfig } from 'axios';

const axiosRequestConfig: AxiosRequestConfig = {
  timeout: 1000,  // デフォルトは 0 でタイムアウトしない設定です。
}

const client = new CybozuOffice({
  baseUrl: 'https://192.168.0.1/xxxx/xxxx/ag.cgi',
  accountId: 'hoge',
  password: 'hogehoge',
  axiosRequestConfig
});
```

設定可能な項目については [axios - リクエスト設定](https://axios-http.com/ja/docs/req_config) をご参照ください。  
また、すべての項目を適用する実装にしていますが、項目によっては cb10-sdk が意図しない挙動になる可能性があるため、ご注意ください。
