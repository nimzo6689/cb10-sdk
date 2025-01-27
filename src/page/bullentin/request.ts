import { Defaults, MessageEditMode } from '../../common/Constants';
import { CustomURLParams } from '../../common/Transport';
import { BulletinCommentRequest } from './models';

const PAGE_PREFIX = 'Bulletin';

export default class BulletinRequestOptions {
  /**
   * グループメンバー取得のリクエストオプション
   *
   * @param groupId - グループID
   * @returns リクエストオプション
   */
  static sendComment({ bid, data, group = Defaults.GROUP_NAME }: BulletinCommentRequest): CustomURLParams {
    return {
      page: `Ajax${PAGE_PREFIX}FollowAdd`,
      EditMode: `${MessageEditMode.TEXT}`,
      Group: group,
      Data: data,
      BID: bid,
    };
  }
}
