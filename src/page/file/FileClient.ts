import Transport from '../../common/Transport';
import { CybozuOfficeSDKException } from '../../common/Errors';
import { FileDownloadOptions } from './models';
import FileRequestOptions from './request';

/**
 * Cybozu Office 10のファイル管理機能にアクセスするためのクライアントクラス
 *
 * このクラスはファイルのダウンロードなどの機能を提供します。
 */
export default class FileClient {
  constructor(private readonly transport: Transport) {}

  /**
   * ファイルをダウンロード
   *
   * @param options - ダウンロードオプション
   * @returns ファイルの内容
   * @throws {CybozuOfficeSDKException} ダウンロードに失敗した場合
   */
  async downloadFile(options: FileDownloadOptions): Promise<string> {
    try {
      return await this.transport.get(FileRequestOptions.downloadFile(options));
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
