/**
 * フォルダ内のメッセージ情報を定義するインターフェース
 *
 * @interface FolderMessage
 * @property {number | null} mDBID - メッセージのデータベースID
 * @property {number | null} mDID - メッセージのドキュメントID
 * @property {string} subject - メッセージの件名
 */
export interface FolderMessage {
  mDBID: number | null;
  mDID: number | null;
  subject: string;
}

/**
 * フォルダ一覧取得のオプションを定義するインターフェース
 *
 * @interface FolderIndexOptions
 * @property {number | string} folderId - フォルダID（FID）または特殊フォルダ名
 * @property {number} [reversed] - 昇順フラグ（0は降順、1は昇順）
 */
export interface FolderIndexOptions {
  folderId: number | string;
  reversed?: number;
}
