const PAGE_PREFIX = 'UserList';

export default class UserRequestOptions {
  /**
   * グループメンバー取得のリクエストオプション
   *
   * @param groupId - グループID
   * @returns リクエストオプション
   */
  static groupMembersList(groupId: number): Record<string, number | string> {
    return {
      page: `${PAGE_PREFIX}Index`,
      GID: groupId,
    };
  }
}
