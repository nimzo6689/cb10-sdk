/**
 * 掲示板コメントのデータを定義するインターフェース
 *
 * @interface BulletinCommentRequest
 * @property {number} bid - 掲示板のURLに含まれているBID
 * @property {string} data - コメント本文
 * @property {string} [group] - コメントする際に表示されるグループ名
 */
export interface BulletinCommentRequest {
  bid: number;
  data: string;
  group?: string;
}
