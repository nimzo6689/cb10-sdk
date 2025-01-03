import { Defaults, MessageEditMode } from '../common/Constants';
import { Utils } from '../common/Helpers';
import Transport from '../common/Transport';
import { CybozuOfficeSDKException } from '../common/Errors';

/**
 * 掲示板コメントのデータを定義するインターフェース
 *
 * @interface BulletinCommentData
 * @property {string} bid - 掲示板のURLに含まれているBID
 * @property {string} data - コメント本文
 * @property {string} [group] - コメントする際に表示されるグループ名
 */
interface BulletinCommentData {
  bid: string;
  data: string;
  group?: string;
}

/**
 * Cybozu Office 10の掲示板機能にアクセスするためのクライアントクラス
 *
 * このクラスは掲示板の閲覧、コメントの投稿などの機能を提供します。
 *
 * @example
 * ```typescript
 * const transport = new Transport('https://example.cybozu.com/ag.cgi', 'username', 'password');
 * const client = new BulletinClient(transport);
 *
 * // コメントを追加
 * await client.addComment({
 *   bid: '123',
 *   data: 'コメント本文',
 *   group: '営業部'
 * });
 * ```
 */
export default class BulletinClient {
  /**
   * 掲示板関連ページの共通プレフィックス
   * 全インスタンスで共通の値のため、static readonlyとして定義
   */
  private static readonly PAGE_PREFIX = 'Bulletin';

  /**
   * BulletinClientのインスタンスを作成
   *
   * @param transport - サイボウズOffice10への通信を行うTransportインスタンス
   */
  constructor(private readonly transport: Transport) {}

  /**
   * 掲示板にコメントを追加
   *
   * @param commentData - コメントデータ
   * @returns コメントの追加が成功したかどうか
   * @throws {CybozuOfficeSDKException} コメントの追加に失敗した場合
   *
   * @example
   * ```typescript
   * await client.addComment({
   *   bid: '123',
   *   data: 'コメント本文',
   *   group: '営業部'
   * });
   * ```
   */
  async addComment(commentData: BulletinCommentData): Promise<boolean> {
    try {
      const { bid, data, group = Defaults.GROUP_NAME } = commentData;

      await this.transport.post(
        Utils.buildQuery({
          page: `Ajax${BulletinClient.PAGE_PREFIX}FollowAdd`,
          EditMode: MessageEditMode.TEXT,
          Group: group,
          Data: data,
          BID: bid,
        })
      );

      return true;
    } catch (error) {
      if (error instanceof CybozuOfficeSDKException) {
        throw error;
      }
      throw new CybozuOfficeSDKException(
        `Failed to add comment: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
