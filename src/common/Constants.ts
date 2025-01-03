/**
 * サポートされているエンコーディングタイプ
 *
 * @enum {string}
 */
export enum Encoding {
  /**
   * UTF-8エンコーディング
   */
  UTF_8 = 'utf-8',

  /**
   * Shift-JISエンコーディング
   */
  SHIFT_JIS = 'Shift_JIS',
}

/**
 * メッセージ編集モード
 *
 * @enum {number}
 */
export enum MessageEditMode {
  /**
   * プレーンテキストモード
   */
  TEXT = 0,

  /**
   * リッチテキスト（HTML）モード
   */
  HTML = 1,
}

/**
 * コンテンツタイプの定義
 *
 * @constant {Object}
 */
export const ContentType = {
  /**
   * application/x-www-form-urlencoded
   * HTMLフォームのデフォルトのコンテンツタイプ
   */
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
} as const;

/**
 * デフォルト設定値の定義
 *
 * @constant {Object}
 */
export const Defaults = {
  /**
   * デフォルトのグループ名
   */
  GROUP_NAME: 'サイボウズ Bot',
} as const;
