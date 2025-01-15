import { GetOptions } from '../../common/Transport';
import { FileDownloadOptions } from './models';

export default class FileRequestOptions {
  static readFile(options: FileDownloadOptions): GetOptions {
    const { path, query, encoding = 'utf-8' } = options;

    return {
      path,
      query: { ...query },
      encoding,
      responseType: 'file',
    };
  }
}
