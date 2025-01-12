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
  query: string;
  encoding?: BufferEncoding;
}
