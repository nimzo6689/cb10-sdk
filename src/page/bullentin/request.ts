import { Defaults, MessageEditMode } from '../../common/Constants';
import { Utils } from '../../common/Helpers';
import { BulletinCommentData } from './models';

const PAGE_PREFIX = 'Bulletin';

export default class BulletinRequestOptions {
  /**
   * グループメンバー取得のリクエストオプション
   *
   * @param groupId - グループID
   * @returns リクエストオプション
   */
  static addComment(commentData: BulletinCommentData): string {
    const { bid, data, group = Defaults.GROUP_NAME } = commentData;

    return Utils.buildQuery({
      page: `Ajax${PAGE_PREFIX}FollowAdd`,
      EditMode: MessageEditMode.TEXT,
      Group: group,
      Data: data,
      BID: bid,
    });
  }
}
