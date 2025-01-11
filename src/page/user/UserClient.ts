import Transport from '../../common/Transport';
import { CybozuOfficeSDKException } from '../../common/Errors';
import { UserInfo, GroupMembersOptions } from './models';
import UserHtmlParser from './parser';
import UserRequestOptions from './reqests';

/**
 * Cybozu Office 10のユーザー名簿機能にアクセスするためのクライアントクラス
 *
 * このクラスはユーザー情報の取得などの機能を提供します。
 *
 * @example
 * ```typescript
 * const transport = new Transport('https://example.cybozu.com/ag.cgi', 'username', 'password');
 * const client = new UserClient(transport);
 *
 * // グループメンバーを取得
 * const members = await client.getGroupMembers({ groupId: 123 });
 * ```
 */
export default class UserClient {
  /**
   * UserClientのインスタンスを作成
   *
   * @param transport - サイボウズOffice10への通信を行うTransportインスタンス
   */
  constructor(private readonly transport: Transport) {}

  /**
   * グループに所属するユーザー一覧を取得
   *
   * @param options - グループメンバー取得オプション
   * @returns ユーザー情報の配列
   * @throws {CybozuOfficeSDKException} ユーザー情報の取得に失敗した場合
   *
   * @example
   * ```typescript
   * const members = await client.getGroupMembers({ groupId: 123 });
   * console.log(members); // [{ uID: 1, userName: "山田太郎" }, ...]
   * ```
   */
  async getGroupMembers(options: GroupMembersOptions): Promise<UserInfo[]> {
    try {
      const query = UserRequestOptions.groupMembersList(options.groupId);
      const document = await this.transport.get({ query });
      return UserHtmlParser.parseUserList(document);
    } catch (error) {
      if (error instanceof CybozuOfficeSDKException) {
        throw error;
      }
      throw new CybozuOfficeSDKException(
        `Failed to get group members: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
