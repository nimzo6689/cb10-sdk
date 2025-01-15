/**
 * 掲示板コメントのデータを定義するインターフェース
 *
 * @interface BulletinCommentRequest
 * @property {string} bid - 掲示板のURLに含まれているBID
 * @property {string} data - コメント本文
 * @property {string} [group] - コメントする際に表示されるグループ名
 */
export interface BulletinCommentRequest {
  bid: string;
  data: string;
  group?: string;
}
