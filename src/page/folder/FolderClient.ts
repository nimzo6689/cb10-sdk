import Transport from '../../common/Transport';
import { FolderIndexOptions, FolderMessage } from './models';
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
   * @param reversed - 昇順フラグ（0は降順、1は昇順）
   * @returns メッセージ一覧、一覧が空の場合はnull
   */
  inbox(reversed: number = 0): Promise<FolderMessage[] | null> {
    return this.#getMessages({ folderId: 'inbox', reversed });
  }

  /**
   * 送信箱のメッセージ一覧を取得
   *
   * @param reversed - 昇順フラグ（0は降順、1は昇順）
   * @returns メッセージ一覧、一覧が空の場合はnull
   */
  sent(reversed: number = 0): Promise<FolderMessage[] | null> {
    return this.#getMessages({ folderId: 'sent', reversed });
  }

  /**
   * 下書きのメッセージ一覧を取得
   *
   * @param reversed - 昇順フラグ（0は降順、1は昇順）
   * @returns メッセージ一覧、一覧が空の場合はnull
   */
  unsent(reversed: number = 0): Promise<FolderMessage[] | null> {
    return this.#getMessages({ folderId: 'unsent', reversed });
  }

  /**
   * 指定のフォルダ内のメッセージ一覧を取得
   *
   * @param folderId - フォルダID（FID）
   * @param reversed - 昇順フラグ（0は降順、1は昇順）
   * @returns メッセージ一覧、一覧が空の場合はnull
   */
  getByFolderId(folderId: number, reversed: number = 0): Promise<FolderMessage[] | null> {
    return this.#getMessages({ folderId, reversed });
  }

  /**
   * 個人フォルダのメッセージ一覧を取得
   *
   * @param options - フォルダ一覧取得オプション
   * @returns メッセージ一覧、一覧が空の場合はnull
   * @throws {CybozuOfficeSDKException} メッセージの取得に失敗した場合
   */
  async #getMessages(options: FolderIndexOptions): Promise<FolderMessage[] | null> {
    const query = FolderRequestOptions.addComment(options);
    const document = await this.transport.get({ query });
    return FolderHtmlParser.getMessages(document);
  }
}
