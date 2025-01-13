import Transport from '../../common/Transport';
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
  downloadFile(options: FileDownloadOptions): Promise<string> {
    return this.transport.get(FileRequestOptions.downloadFile(options));
  }
}
