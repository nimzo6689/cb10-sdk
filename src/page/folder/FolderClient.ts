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
   * 個人フォルダのメッセージ一覧を取得
   *
   * @param options - フォルダ一覧取得オプション
   * @returns メッセージ一覧、一覧が空の場合はnull
   * @throws {CybozuOfficeSDKException} メッセージの取得に失敗した場合
   */
  async getMessages({ folderId, reversed = 0 }: FolderIndexOptions): Promise<FolderMessage[] | null> {
    const query = FolderRequestOptions.getMessages({ folderId, reversed });
    const document = await this.transport.get({ query });
    return FolderHtmlParser.getMessages(document);
  }
}
