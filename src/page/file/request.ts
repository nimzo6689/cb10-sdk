import { GetOptions } from '../../common/Transport';
import { FileDownloadOptions } from './models';

export default class FileRequestOptions {
  static readFile({ path, query, encoding = 'utf-8' }: FileDownloadOptions): GetOptions {
    return {
      path,
      query: { ...query },
      encoding,
      responseType: 'file',
    };
  }
}
