import Transport from '../common/Transport';
import { CybozuOfficeSDKException } from '../common/Errors';

/**
 * ファイルダウンロードのオプションを定義するインターフェース
 *
 * @interface FileDownloadOptions
 * @property {string} path - ダウンロードするファイルのパス
 * @property {string} query - クエリ文字列
 * @property {BufferEncoding} [encoding] - ファイルのエンコーディング（デフォルト: 'utf-8'）
 */
interface FileDownloadOptions {
  path: string;
  query: string;
  encoding?: BufferEncoding;
}

/**
 * Cybozu Office 10のファイル管理機能にアクセスするためのクライアントクラス
 *
 * このクラスはファイルのダウンロードなどの機能を提供します。
 *
 * @example
 * ```typescript
 * const transport = new Transport('https://example.cybozu.com/ag.cgi', 'username', 'password');
 * const client = new FileClient(transport);
 *
 * // ファイルをダウンロード
 * const content = await client.downloadFile({
 *   path: 'document.txt',
 *   query: 'fid=123',
 *   encoding: 'utf-8'
 * });
 * ```
 */
export default class FileClient {
  /**
   * FileClientのインスタンスを作成
   *
   * @param transport - サイボウズOffice10への通信を行うTransportインスタンス
   */
  constructor(private readonly transport: Transport) {}

  /**
   * ファイルをダウンロード
   *
   * @param options - ダウンロードオプション
   * @returns ファイルの内容
   * @throws {CybozuOfficeSDKException} ダウンロードに失敗した場合
   *
   * @example
   * ```typescript
   * const content = await client.downloadFile({
   *   path: 'document.txt',
   *   query: 'fid=123',
   *   encoding: 'utf-8'
   * });
   * ```
   */
  async downloadFile(options: FileDownloadOptions): Promise<string> {
    try {
      const { path, query, encoding = 'utf-8' } = options;

      return await this.transport.get({
        path,
        query,
        encoding,
        responseType: 'file',
      });
    } catch (error) {
      if (error instanceof CybozuOfficeSDKException) {
        throw error;
      }
      throw new CybozuOfficeSDKException(
        `Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
