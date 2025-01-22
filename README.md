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

## 特徴

一般的な Web スクレイピング手法と比べた cb10-sdk の主な利点は以下の通りです。

1. 充実した機能

- [継続サービスライセンス不要の主要機能](https://faq.cybozu.info/alphascope/cybozu/web/office10/Detail.aspx?id=1510&isCrawler=1)（メッセージ、掲示板等）に対応
- プロキシやBASIC認証などの柔軟な通信設定が可能
- 未対応機能も独自に拡張可能なインターフェースを提供

2. 軽量な実装

- 静的ファイルのダウンロードを最小限に抑制
- ブラウザ起動不要で高速な実行と低リソース消費
- 最適化された通信制御による低負荷な動作

3. モダンな開発環境

- マルチプラットフォーム対応（Windows, macOS, Linux, AWS Lambda等）
- TypeScriptによる優れた開発体験
- npmによる簡単な導入とバージョン管理

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
import CybozuOffice from 'cb10-sdk';

const client = new CybozuOffice({
  baseUrl: 'https://onlinedemo.cybozu.info/scripts/office10/ag.cgi',
  id: '17',
  password: '',
});

// グループ ID が 13（総務部）のユーザ一覧を取得
const groupMembers = await client.user.getMembers({ groupId: 13 });
groupMembers.forEach(it => JSON.stringify(it));
// { uID: 17, userName: '高橋 健太' }
// { uID: 27, userName: '加藤 美咲' }
// { uID: 208, userName: '大山 春香' }
```

具体的な使い方については [samples](https://github.com/nimzo6689/cb10-sdk/tree/main/samples) 配下のコードをご参考ください。

### ログイン方法について

サイボウズへのログインする際に、ユーザをプルダウンではなくフォーム入力となっている場合、以下のような実装になります。

```js
const client = new CybozuOffice({
  baseUrl: 'https://your-cybozu-office-site/xxxx/xxxx/ag.cgi',
  accountId: 'hoge',
  password: 'hogehoge',
});
```

### HTTP 通信時の振る舞いを変更をしたい

cb10-sdk では HTTP 通信をする際に [axios](https://axios-http.com/) を使用しており、 `CybozuOffice` のコンストラクタにて、 Request Config のオブジェクトを渡すことで、HTTP 通信時における細かい振る舞いを変更することができます。  
以下、使用例です。

```js
import https from 'https';
import { AxiosRequestConfig } from 'axios';
import CybozuOffice from 'cb10-sdk';

const axiosRequestConfig: AxiosRequestConfig = {
  // 通信時のタイムアウトの時間を 1 秒（1,000 ミリ秒）に変更する
  timeout: 3000,

  // SSL 認証を無効化したい
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),

  // BASIS 認証を使用する
  auth: {
    username: 'janedoe',
    password: 's00pers3cret',
  },

  // PROXY を使用する
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l',
    },
  },
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

### 前回ログインした際のセッション情報を使い回ししたい

サイボウズ Office 10 のセッションはデフォルト設定の場合、前回のアクセスから 24 時間以内であれば有効になります。  
そのため、5 分おきなどにサイボウズから情報を取得するスクリプトを各場合、毎回ログインするのは無駄になるので、以下の方法でセッションを使い回しすることができます。

```js
// 使用していたセッション情報を取得する
const session = previousClient.transport.sessionCredentials;

// 前回使用していたセッション情報を再利用する
const currentClient = new CybozuOffice({
  baseUrl: 'https://your-cybozu-office-site/xxxx/xxxx/ag.cgi',
  accountId: 'hoge',
  password: 'hogehoge',
  sessionCredentials: session,
});

// 前回のセッションが有効期限内であれば、ログインに関する HTTP リクエストは発生しません
currentClient.user.getMembers({ groupId: 13 });
```

また、もしセッションが有効期限切れしていた場合、 SDK 内部で再ログインしてリトライするため、特にユーザ側でセッションが有効期限内かどうかを判定する処理を省略いただいても問題ございません。

### 未対応のページの情報を取得したり、フォームの送信を行いたい

`CybozuOffice` の `transport` にて実装できます。  
`transport` を使うことで、サイボウズ Office 10 への Cookie の取得や、csrf_ticket を Body に入れるといった共通処理をユーザ側で実装する手間がなくなり、HTML のパースやフォームの送信の実装に集中いただけます。

#### `transport.get` で未対応のページの情報を取得する

ページの情報取得の場合、 URL のリクエストパラメータ部分の情報を query にオブジェクトとして渡すことでページの HTML が取得できます。

その後、 Cheerio でパースしてもらえれば、該当の文字列を取得することができます。

```js
import * as cheerio from 'cheerio';

const html = await client.transport.get({
  query: {
    page: 'MyFolderMemoView',
    mEID: 42,
  },
});

const $ = cheerio.load(html);

// メモのタイトルを取得
const title = $('.vr_viewTitleAreaSubject').text();
// メモの本文を取得
const content = $('.vr_mainColumn').text();
```

#### `transport.post` でフォームの送信を行う

ブラウザの開発者ツールにて、「Network」→「Fetch/XHR or Doc」→「Payload」にてフォームの送信内容が確認できるので、そちらを参考に body に指定するオブジェクトを実装することでフォームの送信ができます。

```js
import * as cheerio from 'cheerio';

// 例外がおきなければ送信成功です。
await client.transport.post({
  body: {
    Page: 'MyFolderMemoModify',
    FID: 23,
    EID: 42,
    Subject: '変更後のメモのタイトル',
    EditMode: 0,
    Data: `変更後のメモの本文を送信。
複数行でも可能です。`,
    Submit: '変更する',
    AjaxRequest: 'AjaxRequest',
  },
});
```
