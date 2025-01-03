import Transport from './common/Transport';
import MessageClient from './page/MessageClient';
import FileClient from './page/FileClient';
import UserClient from './page/UserClient';
import FolderClient from './page/FolderClient';
import BulletinClient from './page/BulletinClient';

/**
 * サイボウズOffice接続の設定オプションを定義するインターフェース
 *
 * @interface CybozuOfficeOptions
 * @property {string} baseUrl - 処理対象となるサイボウズのURL（http~/ag.cgiまで）
 * @property {string} accountId - ログインID
 * @property {string} password - パスワード
 * @property {string} [cookie] - 有効期限内のクッキー情報（未指定の場合は自動で取得）
 */
interface CybozuOfficeOptions {
  baseUrl: string;
  accountId: string;
  password: string;
  cookie?: string;
}

/**
 * Cybozu Office 10の操作APIを提供するメインクラス
 *
 * このクラスは以下の機能へのアクセスを提供します：
 * - メッセージ管理 ({@link MessageClient})
 * - ファイル管理 ({@link FileClient})
 * - ユーザー管理 ({@link UserClient})
 * - フォルダ管理 ({@link FolderClient})
 * - 掲示板管理 ({@link BulletinClient})
 *
 * @example
 * ```typescript
 * const office = new CybozuOffice({
 *   baseUrl: 'https://example.cybozu.com/ag.cgi',
 *   accountId: 'username',
 *   password: 'password'
 * });
 *
 * // メッセージを送信
 * await office.message.sendMessage({
 *   subject: '件名',
 *   data: '本文',
 *   uidList: [1, 2, 3]
 * });
 * ```
 */
export class CybozuOffice {
  /**
   * 内部通信を行うTransportインスタンス
   * @private
   */
  private readonly transport: Transport;

  /**
   * メッセージ管理クライアント
   * メッセージの送信、閲覧、編集などの機能を提供します。
   */
  public readonly message: MessageClient;

  /**
   * ファイル管理クライアント
   * ファイルのダウンロードなどの機能を提供します。
   */
  public readonly file: FileClient;

  /**
   * ユーザー管理クライアント
   * ユーザー情報の取得などの機能を提供します。
   */
  public readonly user: UserClient;

  /**
   * フォルダ管理クライアント
   * 個人フォルダの操作機能を提供します。
   */
  public readonly folder: FolderClient;

  /**
   * 掲示板管理クライアント
   * 掲示板の閲覧、投稿などの機能を提供します。
   */
  public readonly bulletin: BulletinClient;

  /**
   * CybozuOfficeのインスタンスを作成します
   *
   * @param options - サイボウズOfficeの接続オプション
   *
   * @example
   * ```typescript
   * const office = new CybozuOffice({
   *   baseUrl: 'https://example.cybozu.com/ag.cgi',
   *   accountId: 'username',
   *   password: 'password'
   * });
   * ```
   */
  constructor(options: CybozuOfficeOptions) {
    const { baseUrl, accountId, password, cookie } = options;
    this.transport = new Transport(baseUrl, accountId, password, cookie);

    // 各クライアントのインスタンスを生成
    this.message = new MessageClient(this.transport);
    this.file = new FileClient(this.transport);
    this.user = new UserClient(this.transport);
    this.folder = new FolderClient(this.transport);
    this.bulletin = new BulletinClient(this.transport);
  }
}
