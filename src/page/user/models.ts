/**
 * ユーザー情報を定義するインターフェース
 *
 * @interface UserInfo
 * @property {number} uID - ユーザーID
 * @property {string} userName - ユーザー名
 */
export interface UserInfo {
  uID: number;
  userName: string;
}

/**
 * グループメンバー取得のオプションを定義するインターフェース
 *
 * @interface GroupMembersOptions
 * @property {number} groupId - グループID
 */
export interface GroupMembersOptions {
  groupId: number;
}
