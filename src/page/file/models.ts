/**
 * ファイルダウンロードのオプションを定義するインターフェース
 *
 * @interface FileDownloadOptions
 * @property {string} path - ダウンロードするファイルのパス
 * @property {string} query - クエリ文字列
 * @property {BufferEncoding} [encoding] - ファイルのエンコーディング（デフォルト: 'utf-8'）
 */
export interface FileDownloadOptions {
  path: string;
  query: FileDownloadQueryOptions;
  encoding?: BufferEncoding;
}

export interface FileDownloadQueryOptions {
  page: string;
  id: string;
  mDBID: string;
  mEID: string;
  mDID: string;
  notimecard: string;
  type: string;
  subtype: string;
  ct: string;
  ext: string;
}
