import { CustomURLParams } from './../../common/Transport';
import { GroupMembersOptions } from './models';

const PAGE_PREFIX = 'UserList';

export default class UserRequestOptions {
  /**
   * グループメンバー取得のリクエストオプション
   *
   * @param options - グループメンバー取得オプション
   * @returns リクエストオプション
   */
  static getMembers(options: GroupMembersOptions): CustomURLParams {
    return {
      page: `${PAGE_PREFIX}Index`,
      GID: options.groupId,
    };
  }
}
