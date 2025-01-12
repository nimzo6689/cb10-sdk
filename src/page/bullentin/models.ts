/**
 * 掲示板コメントのデータを定義するインターフェース
 *
 * @interface BulletinCommentData
 * @property {string} bid - 掲示板のURLに含まれているBID
 * @property {string} data - コメント本文
 * @property {string} [group] - コメントする際に表示されるグループ名
 */
export interface BulletinCommentData {
  bid: string;
  data: string;
  group?: string;
}
