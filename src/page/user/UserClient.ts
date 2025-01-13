import Transport from '../../common/Transport';
import { UserInfo, GroupMembersOptions } from './models';
import UserHtmlParser from './parser';
import UserRequestOptions from './reqests';

/**
 * Cybozu Office 10のユーザー名簿機能にアクセスするためのクライアントクラス
 *
 * このクラスはユーザー情報の取得などの機能を提供します。
 */
export default class UserClient {
  constructor(private readonly transport: Transport) {}

  /**
   * グループに所属するユーザー一覧を取得
   *
   * @param options - グループメンバー取得オプション
   * @returns ユーザー情報の配列
   * @throws {CybozuOfficeSDKException} ユーザー情報の取得に失敗した場合
   */
  async getGroupMembers(options: GroupMembersOptions): Promise<UserInfo[]> {
    const query = UserRequestOptions.groupMembersList(options.groupId);
    const document = await this.transport.get({ query });
    return UserHtmlParser.parseUserList(document);
  }
}
