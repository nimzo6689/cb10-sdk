import { CybozuOfficeSDKException } from '../../common/Errors';
import Transport from '../../common/Transport';
import { Notification } from './models';
import NotificationHtmlParser from './parser';

/**
 * Cybozu Office 10のユーザー名簿機能にアクセスするためのクライアントクラス
 *
 * このクラスは通知一覧の取得などの機能を提供します。
 */
export default class NotificationClient {
  constructor(private readonly transport: Transport) {}

  /**
   * 未読一覧を取得
   *
   * @returns 未読情報
   * @throws {CybozuOfficeSDKException} 通信エラーが発生した場合
   */
  async getContents(options: { kind: 'unread' | 'read' }): Promise<Notification> {
    if (options.kind === 'read') {
      throw new CybozuOfficeSDKException('未読一覧の取得のみサポートしています。');
    }

    const html = await this.transport.get({ query: { page: 'NotificationIndex' } });
    return NotificationHtmlParser.parseContent(html);
  }
}
