import Transport from '../../common/Transport';
import { FolderIndexOptions, FolderNamedIndexOptions, FolderMessage } from './models';
import FolderRequestOptions from './request';
import FolderHtmlParser from './parser';

/**
 * Cybozu Office 10の個人フォルダ機能にアクセスするためのクライアントクラス
 *
 * このクラスは個人フォルダのメッセージ一覧取得などの機能を提供します。
 */
export default class FolderClient {
  constructor(private readonly transport: Transport) {}

  /**
   * 受信箱のメッセージ一覧を取得
   *
   * @param options - フォルダ一覧取得オプション
   * @returns メッセージ一覧、一覧が空の場合はnull
   */
  getMessagesOfInbox(options: FolderNamedIndexOptions): Promise<FolderMessage[] | null> {
    return this.#getMessages({ folderId: 'inbox', ...options });
  }

  /**
   * 送信箱のメッセージ一覧を取得
   *
   * @param options - フォルダ一覧取得オプション
   * @returns メッセージ一覧、一覧が空の場合はnull
   */
  getMessagesOfSent(options: FolderNamedIndexOptions): Promise<FolderMessage[] | null> {
    return this.#getMessages({ folderId: 'sent', ...options });
  }

  /**
   * 下書きのメッセージ一覧を取得
   *
   * @param options - フォルダ一覧取得オプション
   * @returns メッセージ一覧、一覧が空の場合はnull
   */
  getMessagesOfUnsent(options: FolderNamedIndexOptions): Promise<FolderMessage[] | null> {
    return this.#getMessages({ folderId: 'unsent', ...options });
  }

  /**
   * 指定のフォルダ内のメッセージ一覧を取得
   *
   * @param folderId - フォルダID（FID）
   * @param reversed - 昇順フラグ（0は降順、1は昇順）
   * @returns メッセージ一覧、一覧が空の場合はnull
   */
  getMessagesByFolderId(options: FolderIndexOptions): Promise<FolderMessage[] | null> {
    return this.#getMessages(options);
  }

  /**
   * 個人フォルダのメッセージ一覧を取得
   *
   * @param options - フォルダ一覧取得オプション
   * @returns メッセージ一覧、一覧が空の場合はnull
   * @throws {CybozuOfficeSDKException} メッセージの取得に失敗した場合
   */
  async #getMessages({ folderId, reversed = 0 }: FolderIndexOptions): Promise<FolderMessage[] | null> {
    const query = FolderRequestOptions.getMessages({ folderId, reversed });
    const document = await this.transport.get({ query });
    return FolderHtmlParser.getMessages(document);
  }
}
