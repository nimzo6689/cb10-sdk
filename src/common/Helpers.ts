/**
 * クエリパラメータの型を定義
 */
type QueryParams = Record<string, string | number | boolean>;

/**
 * ユーティリティ関数を提供するクラス
 */
export class Utils {
  /**
   * キーと値のペアを追加
   *
   * @param kv - 既存の文字列またはオブジェクト
   * @param key - 追加するキー
   * @param value - 追加する値
   * @returns 結合された文字列またはオブジェクト
   */
  static addPair(kv: string | QueryParams, key: string, value: string | number | boolean): string | QueryParams {
    if (typeof kv === 'string') {
      return `${kv}&${key}=${value}`;
    }
    return { ...kv, [key]: value };
  }

  /**
   * オブジェクトをURLクエリ文字列に変換
   *
   * @param params - クエリパラメータ（文字列またはオブジェクト）
   * @returns URLクエリ文字列
   *
   * @example
   * ```typescript
   * Utils.buildQuery({ page: 1, search: 'test' })
   * // => "page=1&search=test"
   * ```
   */
  static buildQuery(params: string | QueryParams): string {
    if (!params) {
      return '';
    }

    if (typeof params === 'string') {
      return params;
    }

    return Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');
  }
}
