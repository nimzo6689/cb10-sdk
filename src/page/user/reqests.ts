import { CustomURLParams } from './../../common/Transport';

const PAGE_PREFIX = 'UserList';

export default class UserRequestOptions {
  /**
   * グループメンバー取得のリクエストオプション
   *
   * @param groupId - グループID
   * @returns リクエストオプション
   */
  static groupMembersList(groupId: number): CustomURLParams {
    return {
      page: `${PAGE_PREFIX}Index`,
      GID: groupId,
    };
  }
}
