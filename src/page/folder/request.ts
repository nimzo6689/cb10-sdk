import { CustomURLParams } from '../../common/Transport';
import { FolderIndexOptions } from './models';

const PAGE_PREFIX = 'MyFolder';

export default class FolderRequestOptions {
  static getMessages({ folderId, reversed = 0 }: FolderIndexOptions): CustomURLParams {
    return {
      page: `${PAGE_PREFIX}Index`,
      FID: folderId,
      rv: reversed,
    };
  }
}
