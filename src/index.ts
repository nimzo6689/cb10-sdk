import Transport, { CybozuOfficeOptions, SessionCredentials } from './common/Transport';
import MessageClient from './page/message/MessageClient';
import FileClient from './page/file/FileClient';
import UserClient from './page/user/UserClient';
import FolderClient from './page/folder/FolderClient';
import BulletinClient from './page/bullentin/BulletinClient';
import NotificationClient from './page/notification/NotificationClient';

export { CybozuOfficeOptions, SessionCredentials };

/**
 * Cybozu Office 10の操作APIを提供するメインクラス
 *
 * このクラスは以下の機能へのアクセスを提供します：
 * - メッセージ管理 ({@link MessageClient})
 * - ファイル管理 ({@link FileClient})
 * - ユーザー管理 ({@link UserClient})
 * - フォルダ管理 ({@link FolderClient})
 * - 掲示板管理 ({@link BulletinClient})
 * - 通知一覧管理 ({@link NotificationClient})
 */
export class CybozuOffice {
  /**
   * 内部通信を行うTransportインスタンス
   */
  readonly transport: Transport;

  /**
   * メッセージ管理クライアント
   * メッセージの送信、閲覧、編集などの機能を提供します。
   */
  readonly message: MessageClient;

  /**
   * ファイル管理クライアント
   * ファイルのダウンロードなどの機能を提供します。
   */
  readonly file: FileClient;

  /**
   * ユーザー管理クライアント
   * ユーザー情報の取得などの機能を提供します。
   */
  readonly user: UserClient;

  /**
   * フォルダ管理クライアント
   * 個人フォルダの操作機能を提供します。
   */
  readonly folder: FolderClient;

  /**
   * 掲示板管理クライアント
   * 掲示板の閲覧、投稿などの機能を提供します。
   */
  readonly bulletin: BulletinClient;

  /**
   * 通知一覧クライアント
   * 未読一覧が取得できる機能を提供します。
   */
  readonly notification: NotificationClient;

  /**
   * CybozuOfficeのインスタンスを作成します
   *
   * @param options - サイボウズOfficeの接続オプション
   */
  constructor(options: CybozuOfficeOptions) {
    this.transport = new Transport(options);

    // 各クライアントのインスタンスを生成
    this.message = new MessageClient(this.transport);
    this.file = new FileClient(this.transport);
    this.user = new UserClient(this.transport);
    this.folder = new FolderClient(this.transport);
    this.bulletin = new BulletinClient(this.transport);
    this.notification = new NotificationClient(this.transport);
  }
}
