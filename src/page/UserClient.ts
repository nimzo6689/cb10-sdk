import * as cheerio from 'cheerio';
import { Element } from 'domhandler';
import Transport from '../common/Transport';
import { CybozuOfficeSDKException } from '../common/Errors';

type CheerioAPI = cheerio.CheerioAPI;

/**
 * ユーザー情報を定義するインターフェース
 *
 * @interface UserInfo
 * @property {number} uID - ユーザーID
 * @property {string} userName - ユーザー名
 */
interface UserInfo {
  uID: number;
  userName: string;
}

/**
 * グループメンバー取得のオプションを定義するインターフェース
 *
 * @interface GroupMembersOptions
 * @property {number} groupId - グループID
 */
interface GroupMembersOptions {
  groupId: number;
}

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
   * ユーザー名簿関連ページの共通プレフィックス
   */
  private static readonly PAGE_PREFIX = 'UserList';

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
  public async getGroupMembers(options: GroupMembersOptions): Promise<UserInfo[]> {
    try {
      const { groupId } = options;
      const document = await this.fetchGroupMembersList(groupId);
      return this.parseUserList(document);
    } catch (error) {
      if (error instanceof CybozuOfficeSDKException) {
        throw error;
      }
      throw new CybozuOfficeSDKException(
        `Failed to get group members: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * グループメンバー一覧のHTMLを取得
   *
   * @param groupId - グループID
   * @returns HTML文字列
   * @private
   */
  private async fetchGroupMembersList(groupId: number): Promise<string> {
    const query = {
      page: `${UserClient.PAGE_PREFIX}Index`,
      GID: groupId,
    };

    return this.transport.get({ query });
  }

  /**
   * ユーザー一覧のHTMLをパース
   *
   * @param html - HTML文字列
   * @returns ユーザー情報の配列
   * @private
   */
  private parseUserList(html: string): UserInfo[] {
    const $ = cheerio.load(html);
    const users: UserInfo[] = [];

    $('table.dataList tr > td:nth-child(1) a').each((_: number, elem: Element) => {
      const userInfo = this.extractUserInfo($, elem);
      if (userInfo && userInfo.uID !== 0) {
        users.push(userInfo);
      }
    });

    return users;
  }

  /**
   * HTML要素からユーザー情報を抽出
   *
   * @param $ - Cheerioインスタンス
   * @param elem - HTML要素
   * @returns ユーザー情報、または抽出に失敗した場合はnull
   * @private
   */
  private extractUserInfo($: CheerioAPI, elem: Element): UserInfo | null {
    const $elem = $(elem);
    const href = $elem.attr('href');
    const uidMatch = href?.match(/(?<=uid=)[0-9]+/i);

    if (!uidMatch) {
      return null;
    }

    return {
      uID: Number(uidMatch[0]),
      userName: $elem.text(),
    };
  }
}
