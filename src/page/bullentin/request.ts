import { Defaults, MessageEditMode } from '../../common/Constants';
import { CustomURLPrams } from '../../common/Transport';
import { BulletinCommentData } from './models';

const PAGE_PREFIX = 'Bulletin';

export default class BulletinRequestOptions {
  /**
   * グループメンバー取得のリクエストオプション
   *
   * @param groupId - グループID
   * @returns リクエストオプション
   */
  static addComment(commentData: BulletinCommentData): CustomURLPrams {
    const { bid, data, group = Defaults.GROUP_NAME } = commentData;

    return {
      page: `Ajax${PAGE_PREFIX}FollowAdd`,
      EditMode: `${MessageEditMode.TEXT}`,
      Group: group,
      Data: data,
      BID: bid,
    };
  }
}
