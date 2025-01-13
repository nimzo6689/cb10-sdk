import { CustomURLPrams } from '../../common/Transport';
import { FolderIndexOptions } from './models';

const PAGE_PREFIX = 'MyFolder';

export default class FolderRequestOptions {
  static addComment(options: FolderIndexOptions): CustomURLPrams {
    const { folderId, reversed = 0 } = options;

    return {
      page: `${PAGE_PREFIX}Index`,
      FID: folderId,
      rv: reversed,
    };
  }
}
