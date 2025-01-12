import { GetOptions } from '../../common/Transport';
import { CybozuOfficeSDKException } from '../../common/Errors';
import { FileDownloadOptions } from './models';

export default class FileRequestOptions {
  static downloadFile(options: FileDownloadOptions): GetOptions {
    try {
      const { path, query, encoding = 'utf-8' } = options;

      return {
        path,
        query,
        encoding,
        responseType: 'file',
      };
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
